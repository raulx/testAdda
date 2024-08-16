import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const otpSchema = mongoose.Schema(
  {
    clientId: { type: String, index: true },
    otp: { type: String },
  },
  { timestamps: true }
);

otpSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) return next();

  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

otpSchema.methods.matchOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

const Onetimepassword = mongoose.model('Onetimepassword', otpSchema);

export { Onetimepassword };
