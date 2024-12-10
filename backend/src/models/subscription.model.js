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
        expires_in: { type: Date, required: true },
    },
    { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
