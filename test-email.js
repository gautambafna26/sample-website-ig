// Test script to verify email functionality
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Test Sender" <${process.env.GMAIL_EMAIL}>`,
    to: 'gautambafna26@gmail.com',
    subject: 'Test Email from Website',
    text: 'This is a test email from your website!',
    html: '<b>This is a test email from your website!</b>'
  });

  console.log('Message sent: %s', info.messageId);
}

testEmail().catch(console.error);
