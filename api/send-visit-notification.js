import * as emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Template parameters must match your EmailJS template variables
  const templateParams = {
    to_email: 'gautambafna26@gmail.com',
    from_name: 'Website Visitor Notifier',
    subject: 'New Website Visitor',
    message: `New website visit details:
              Page: ${req.body.page || 'Unknown'}
              Referrer: ${req.body.referrer || 'Direct visit'}
              Time: ${new Date().toLocaleString()}`,
    page: req.body.page || 'Unknown',
    referrer: req.body.referrer || 'Direct visit',
    date: new Date().toLocaleString(),
    time: new Date().toLocaleTimeString()
  };

  try {
    console.log('Sending email with params:', {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID,
      publicKey: process.env.EMAILJS_PUBLIC_KEY ? '***' : 'MISSING',
      privateKey: process.env.EMAILJS_PRIVATE_KEY ? '***' : 'MISSING'
    });

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,   // e.g. service_01ctk4d
      process.env.EMAILJS_TEMPLATE_ID,  // e.g. template_xxxxxx
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log('Email sent successfully:', result);
    res.status(200).json({
      status: 'success',
      message: 'Notification sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      response: error.response?.data
    });

    res.status(500).json({
      status: 'error',
      message: 'Failed to send notification',
      error: error.message || 'Unknown error',
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
