import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const adminSchema = new Schema({
    adminId: { type: String, index: true, unique: true, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.methods.generateToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            userId: this.userId,
        },
        process.env.ADMIN_TOKEN_SECRET,
        {
            expiresIn: process.env.ADMIN_TOKEN_EXPIRY,
        }
    );
};
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
