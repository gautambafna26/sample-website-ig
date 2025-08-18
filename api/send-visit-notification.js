const EmailJS = require('@emailjs/nodejs');

// Initialize EmailJS with your public API key
const emailjs = EmailJS.init('sTmW7RP4RkKdXUA9Z');

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
    const result = await EmailJS.send(
      'service_01', // Replace with your service ID
      'template_01', // Replace with your template ID
      templateParams,
      'sTmW7RP4RkKdXUA9Z' // Public key
    );
    
    console.log('Email sent successfully:', result);
    res.status(200).json({ 
      status: 'success',
      message: 'Notification sent successfully',
      data: result 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to send notification',
      error: error.message || 'Unknown error occurred',
      details: error.response?.data || {}
    });
  }
}
