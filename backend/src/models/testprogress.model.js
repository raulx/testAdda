import mongoose, { Schema } from 'mongoose';

const testProgressSchema = new Schema({
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionsAttempted: [
        {
            questionId: String,
            answerMarked: String,
            timeTaken: Number,
            review: Boolean,
        },
    ],
    onQuestion: Number,
    timeRemaining: Number,
});

const TestProgress = mongoose.model('TestProgress', testProgressSchema);

// testProgressSchema.index({ quizId: 1, userId: 1 }, { unique: true });

export default TestProgress;
