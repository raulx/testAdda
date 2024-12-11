import mongoose, { Schema } from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { availableSubscriptions } from '../constants.js';

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

    // monthly subscription
    if (amountPaid === availableSubscriptions.monthly.price) {
        expiryDate.setDate(
            today.getDate() + availableSubscriptions.monthly.duration
        );
    }
    // halfYearly subscription
    else if (amountPaid === availableSubscriptions.halfYearly.price) {
        expiryDate.setDate(
            today.getDate() + availableSubscriptions.halfYearly.duration
        ); // full year subscription
    } else if (amountPaid === availableSubscriptions.yearly.price) {
        expiryDate.setDate(
            today.getDate() + availableSubscriptions.yearly.price
        ); // 12 months subscription if amount is greater than Rs550
    } else {
        throw new ApiError(
            400,
            `Subscription for Amount ${amountPaid} is not Available !`
        );
    }
    this.expires_in = expiryDate;
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
