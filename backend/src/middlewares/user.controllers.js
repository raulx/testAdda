import asynHandler from 'express-async-handler';

const sendEmailOtp = asynHandler(async (req, res) => {
  res.json({ status: 200, message: 'Email Generated successfully..' });
});

export { sendEmailOtp };
