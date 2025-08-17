import nodemailer from 'nodemailer';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Your Gmail App Password (not your regular password)
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const mailOptions = {
    from: `"Website Visitor Notifier" <${process.env.GMAIL_EMAIL}>`,
    to: 'gautambafna26@gmail.com',
    subject: 'New Website Visitor',
    text: `Someone visited your website at ${new Date().toLocaleString()}

Page: ${req.body.page || 'Unknown'}
Referrer: ${req.body.referrer || 'Direct visit'}

---
This is an automated message.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a90e2;">New Website Visitor</h2>
        <p>Someone visited your website at ${new Date().toLocaleString()}</p>
        <p><strong>Page:</strong> ${req.body.page || 'Unknown'}</p>
        <p><strong>Referrer:</strong> ${req.body.referrer || 'Direct visit'}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Error sending notification',
      error: error.message 
    });
  }
}
