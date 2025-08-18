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
    // Log detailed error information
    const errorDetails = {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
      response: error.response?.data,
      env: {
        serviceId: process.env.EMAILJS_SERVICE_ID ? 'Set' : 'Missing',
        templateId: process.env.EMAILJS_TEMPLATE_ID ? 'Set' : 'Missing',
        publicKey: process.env.EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing',
        privateKey: process.env.EMAILJS_PRIVATE_KEY ? 'Set' : 'Missing',
        nodeEnv: process.env.NODE_ENV || 'not set'
      },
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
      }
    };

    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));

    // Return a more detailed error response
    res.status(500).json({
      status: 'error',
      message: 'Failed to send notification',
      error: error.message || 'Unknown error',
      code: error.code,
      envStatus: {
        serviceId: errorDetails.env.serviceId,
        templateId: errorDetails.env.templateId,
        publicKey: errorDetails.env.publicKey ? 'Set' : 'Missing',
        privateKey: errorDetails.env.privateKey ? 'Set' : 'Missing'
      },
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}
