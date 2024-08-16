import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    requird: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
