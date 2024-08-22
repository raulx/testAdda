import mongoose, { Schema } from 'mongoose';

const attemptSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
        questions_attempted: [
            { question_id: { type: Schema.Types.ObjectId, ref: 'Question' } },
        ],
        time_taken: { type: Number, required: true },
    },
    { timestamps: true }
);

attemptSchema.index({ user_id: 1, quiz_id: 1 }, { unique: true });

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
