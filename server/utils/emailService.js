const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendBookingConfirmation = async (toEmail, bookingDetails) => {
    try {
        const mailOptions = {
            from: `"AutoCare Pro" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Booking Confirmation – AutoCare Pro',
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:30px;border-radius:12px;">
          <h1 style="color:#3b82f6;text-align:center;">🚗 AutoCare Pro</h1>
          <h2 style="color:#f97316;text-align:center;">Booking Confirmed!</h2>
          <div style="background:#1e293b;padding:20px;border-radius:8px;margin:20px 0;">
            <p><strong>Service:</strong> ${bookingDetails.service || 'N/A'}</p>
            <p><strong>Date:</strong> ${bookingDetails.date || 'N/A'}</p>
            <p><strong>Car:</strong> ${bookingDetails.car || 'N/A'}</p>
            <p><strong>Amount:</strong> ₹${bookingDetails.amount || '0'}</p>
            <p><strong>Status:</strong> <span style="color:#22c55e;">Pending</span></p>
          </div>
          <p style="text-align:center;color:#94a3b8;">Thank you for choosing AutoCare Pro!</p>
        </div>
      `,
        };
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to', toEmail);
    } catch (error) {
        console.error('Email sending failed:', error.message);
    }
};

const sendContactNotification = async (contactData) => {
    try {
        const mailOptions = {
            from: `"AutoCare Pro" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New Contact: ${contactData.subject}`,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong> ${contactData.message}</p>
        </div>
      `,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Contact notification email failed:', error.message);
    }
};

module.exports = { sendBookingConfirmation, sendContactNotification };
