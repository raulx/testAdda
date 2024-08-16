import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const otpSchema = new Schema(
  {
    clientId: { type: String, index: true },
    otp: { type: String },
    isVerified: { type: Boolean, default: false },
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

const Otp = mongoose.model('Otp', otpSchema);

export { Otp };
