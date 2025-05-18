// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import basicAuth from 'express-basic-auth';
import { connectDB, Booking } from './db.js';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/book', async (req, res) => {
  const { name, email, date, details, requestVideo } = req.body;

  const summaryText = `New Dreamscape Booking:\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nVideo Consultation: ${requestVideo ? 'Yes' : 'No'}\n\nDetails:\n${details}`;

  const clientMail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Dreamscape Booking Confirmation',
    text: summaryText
  };

  const adminMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New Dreamscape Booking Received',
    html: `
      <h2>New Booking Notification</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Video Consultation:</strong> ${requestVideo ? 'Yes' : 'No'}</p>
      <p><strong>Details:</strong><br/>${details.replace(/\n/g, '<br/>')}</p>
      <p><a href="${process.env.ADMIN_DASH || 'http://localhost:5000/admin'}" style="color:#7f5af0">Go to Admin Dashboard</a></p>
    `
  };

  try {
    const booking = new Booking({ name, email, date, details, requestVideo });
    await booking.save();
    await transporter.sendMail(clientMail);
    await transporter.sendMail(adminMail);
    res.status(200).json({ success: true, message: 'Booking confirmed and emails sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to save booking or send emails.' });
  }
});

app.use('/api/export', basicAuth({
  users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASS },
  challenge: true
}));

app.get('/api/export', async (req, res) => {
  try {
    const bookings = await Booking.find();
    const data = bookings.map(b => ({
      Name: b.name,
      Email: b.email,
      Date: b.date,
      Details: b.details,
      VideoConsult: b.requestVideo ? 'Yes' : 'No',
      Timestamp: b.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

    const exportPath = path.join('exports', `dreamscape-bookings-${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, exportPath);
    res.download(exportPath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Export failed');
  }
});

app.get('/admin', basicAuth({
  users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASS },
  challenge: true
}), (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/api/all', basicAuth({
  users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASS },
  challenge: true
}), async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Failed to load bookings');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
