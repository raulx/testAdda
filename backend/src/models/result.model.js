import mongoose, { Schema } from 'mongoose';

const resultSchema = new Schema({
    attempt_id: {
        type: Schema.Types.ObjectId,
        ref: 'Attempt',
        required: true,
        unique: true,
    },
    quiz_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    result: {
        correct: { type: Number, required: true },
        wrong: { type: Number, required: true },
        unattempted: { type: Number, required: true },
        marks_obtained: { type: Number, required: true },
    },
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
