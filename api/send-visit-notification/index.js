const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed' 
    });
  }

  try {
    const { page = 'Unknown', referrer = 'Direct visit' } = req.body;

    const mailOptions = {
      from: `"Website Visitor Notifier" <${process.env.GMAIL_EMAIL}>`,
      to: 'gautambafna26@gmail.com',
      subject: 'New Website Visitor',
      text: `Someone visited your website at ${new Date().toLocaleString()}

Page: ${page}
Referrer: ${referrer}

---
This is an automated message.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">New Website Visitor</h2>
          <p>Someone visited your website at ${new Date().toLocaleString()}</p>
          <p><strong>Page:</strong> ${page}</p>
          <p><strong>Referrer:</strong> ${referrer}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">This is an automated message.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      status: 'success',
      message: 'Notification sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to send notification',
      error: error.message 
    });
  }
};
