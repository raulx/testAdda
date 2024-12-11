import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema(
    {
        email: {
            type: String,
            index: true,
            required: true,
            unique: true,
        },
        payment_id: { type: String, required: true },
        amount_paid: { type: Number, required: true },
        expires_in: { type: Date },
    },
    { timestamps: true }
);

subscriptionSchema.pre('save', async function (next) {
    const amountPaid = this.amount_paid;
    const today = new Date();
    const expiryDate = new Date();
    if (250 > amountPaid > 0) {
        expiryDate.setDate(today.getDate() + 30); // 1 month subscription if amount is less than 250Rs.
    } else if (550 > amountPaid > 250) {
        expiryDate.setDate(today.getDate() + 180); // 6 month subscription if amount is greater than Rs250 but less than Rs550.
    } else {
        expiryDate.setDate(today.getDate() + 365); // 12 months subscription if amount is greater than Rs550
    }
    this.expires_in = expiryDate;
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
