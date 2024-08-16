import asynHandler from 'express-async-handler';

import { sendMail } from '../services/sendMail.js';
import { ApiError } from '../utils/ApiError.js';
import getTemplate from '../utils/getTemplate.js';

const sendEmailOtp = asynHandler(async (req, res) => {
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
    res.json({
      status: 200,
      data: mailInfo,
      message: 'Mail Sent Successfully !!',
    });
  } catch (err) {
    throw new ApiError(500, `Mail Error Occured : ${err}`);
  }
});

export { sendEmailOtp };
