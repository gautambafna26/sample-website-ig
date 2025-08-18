import * as emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const templateParams = {
    to_email: 'gautambafna26@gmail.com',
    from_name: 'Website Visitor Notifier',
    subject: 'New Website Visitor',
    message: `Someone visited your website at ${new Date().toLocaleString()}`,
    page: req.body.page || 'Unknown',
    referrer: req.body.referrer || 'Direct visit',
    date: new Date().toLocaleString(),
  };

  try {
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,   // service_01ctk4d
      process.env.EMAILJS_TEMPLATE_ID,  // <-- replace with your actual template ID
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,   // sTmW7RP4RkKdXUA9Z
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // AYthjK9f-yz1EjTSLJWUL
      }
    );

    console.log('Email sent successfully:', result);
    res.status(200).json({
      status: 'success',
      message: 'Notification sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send notification',
      error: error.message || 'Unknown error',
    });
  }
}
