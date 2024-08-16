import asynHandler from 'express-async-handler';
import { sendMail } from '../services/sendMail.js';
import { ApiError } from '../utils/ApiError.js';
import getTemplate from '../utils/getTemplate.js';
import { Otp } from '../models/otp.model.js';

const sendEmailOtp = asynHandler(async (req, res) => {
  // an otp is send to the email and saved with a ttl Index in Otp collection that expires after 10min.
  const { email } = req.body;
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  const htmlTemplate = getTemplate('emailTemplate');
  const htmlContent = htmlTemplate.replace('{{OTP_CODE}}', otpCode);

  try {
    const mailInfo = await sendMail({
      to: email,
      subject: 'Your Otp Code',
      html: htmlContent,
    });

    const newOtp = await Otp.create({
      clientId: email,
      otp: otpCode,
    });

    res.json({
      status: 200,
      mailInfo: mailInfo,
      data: newOtp,
      message: 'New Otp Created Successfully !!',
    });
  } catch (err) {
    throw new ApiError(500, `Mail Error Occured : ${err}`);
  }
});

export { sendEmailOtp };
