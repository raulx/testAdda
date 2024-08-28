// mailer.js
import nodemailer from 'nodemailer';

async function sendMail({ from, to, subject, text, html }) {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Yahoo', // Replace with your email service, e.g., 'Gmail', 'Yahoo', etc.
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
    });

    // Define the email options
    let mailOptions = {
        from: from || process.env.EMAIL_USER, // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html, // HTML body (optional)
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);

    return info;
}

export { sendMail };
