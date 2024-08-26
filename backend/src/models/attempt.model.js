import mongoose, { Schema } from 'mongoose';

const attemptSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
        questions_attempted: [
            {
                questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
                answerMarked: {
                    type: String,
                    enum: ['a', 'b', 'c', 'd', 'unattempted'],
                },
                timeTaken: { type: Number },
            },
        ],
        total_time_taken: { type: Number },
    },
    { timestamps: true }
);

attemptSchema.pre('save', async function (next) {
    const totalTimeTaken = this.questions_attempted.reduce(function (
        acc,
        ques
    ) {
        return acc + ques.timeTaken;
    }, 0);

    this.total_time_taken = totalTimeTaken;
    next();
});
// Create a compound unique index on user and project
// attemptSchema.index({ user_id: 1, quiz_id: 1 }, { unique: true });

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
