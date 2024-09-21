// mailer.js
import nodemailer from 'nodemailer';

async function sendMail({ from, to, subject, text, html }) {
    let transporter = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: from || process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    let info = await transporter.sendMail(mailOptions);

    return info;
}

export { sendMail };
