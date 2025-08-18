const EmailJS = require('@emailjs/nodejs');

// Initialize EmailJS with your public API key
const emailjs = new EmailJS({
  publicKey: 'sTmW7RP4RkKdXUA9Z',
  privateKey: 'AYthjK9f-yz1EjTSLJWUL' // Optional, only needed for certain operations
});

module.exports = async (req, res) => {
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
    date: new Date().toLocaleString()
  };

  try {
    await emailjs.send(
      'service_01', 
      'template_01', 
      templateParams
    );
    
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Error sending notification',
      error: error.message 
    });
  }
}
