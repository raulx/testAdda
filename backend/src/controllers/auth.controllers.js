import asynHandler from 'express-async-handler';
import { sendMail } from '../services/send.mail.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import getTemplate from '../utils/getTemplate.js';
import { Otp } from '../models/otp.model.js';
import User from '../models/user.model.js';

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

  if (!email) throw new ApiError(400, 'Email is required');

  const existingOtp = await Otp.findOne({ clientId: email });

  if (!existingOtp) {
    throw new ApiError(400, 'Session Expired !!');
  }

  if (existingOtp && (await existingOtp.matchOtp(otp))) {
    await existingOtp.updateOne({ isVerified: true });

    res.json(
      new ApiResponse(
        200,
        { clientId: email, otpVerified: true },
        'Verified Successfully'
      )
    );
  } else {
    throw new ApiError(400, 'OTP Not Matched !!');
  }
});

const registerUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, 'All Fields are required !');

  const userExists = await User.findOne({ email: email });

  if (userExists) throw new ApiError(409, 'User Already Exists');

  const newUser = await User.create({ email: email, password: password });

  const responseData = {
    email: newUser.email,
    isSubscribed: newUser.isSubscribed,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    avatarUrl: newUser.avatarUrl,
  };

  res.json(new ApiResponse(200, responseData, 'User Registered Successfully'));
});

const loginUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, 'All Fields are required !');

  const user = await User.findOne({ email: email });

  if (!user) throw new ApiError(404, 'User Not Found !');

  if (user && (await user.isPasswordCorrect(password))) {
    res.json(new ApiResponse(200, 'User Logged In successfully !'));
  } else {
    throw new ApiError(401, 'Password not matched !');
  }
});

export { sendEmailOtp, verifyEmailOtp, registerUser, loginUser };
