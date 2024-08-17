import asynHandler from 'express-async-handler';
import { sendMail } from '../services/send.mail.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import getTemplate from '../utils/getTemplate.js';
import { Otp } from '../models/otp.model.js';

const sendEmailOtp = asynHandler(async (req, res, next) => {
  // an otp is send to the email and saved with a ttl Index in Otp collection that expires after 10min.
  const { email } = req.body;

  if (!email) throw new ApiError(400, 'Email is required');

  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  const htmlTemplate = getTemplate('emailTemplate');
  const htmlContent = htmlTemplate.replace('{{OTP_CODE}}', otpCode);

  // Mail Sent to the email with new optCode.
  await sendMail({
    to: email,
    subject: 'Your Otp Code',
    html: htmlContent,
  });

  // new otpCode saved in otp collection, see otp.model.js

  const newOtp = await Otp.create({
    clientId: email,
    otp: otpCode,
  });

  //note*:otp model has a ttl index referring updatedAt field i.e: it gets expired after 10 min from the last update.

  res.json(new ApiResponse(200, newOtp, 'Otp Send Successfully'));
});

const verifyEmailOtp = asynHandler(async (req, res) => {
  const { email, otp } = req.body;

  const existingOtp = await Otp.findOne({ clientId: email });

  if (!existingOtp) {
    res.json({ status: 400, message: 'Otp Expired' });
  }

  if (existingOtp && (await existingOtp.matchOtp(otp))) {
    await existingOtp.updateOne({ isVerified: true });
    res.json({ status: 200, message: 'verified successfully.' });
  } else {
    res.json({ status: 400, message: 'Invalid Otp' });
  }
});

const registerUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;

  res.json({ email, password });
});

export { sendEmailOtp, verifyEmailOtp, registerUser };
