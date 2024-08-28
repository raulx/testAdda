import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
    question: { type: String, required: true, unique: true, lowercase: true },

    topic: { type: String, required: true, lowercase: true },

    subject: {
        type: String,
        required: true,
        enum: ['mathematics', 'reasoning', 'english'],
    },

    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'moderate', 'hard'],
    },
    correct_option: {
        type: String,
        required: true,
        enum: ['a', 'b', 'c', 'd'],
    },
    options: {
        a: { type: String, required: true },
        b: { type: String, required: true },
        c: { type: String, required: true },
        d: { type: String, required: true },
    },

    explaination: { type: String, required: true },

    quiz_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
    },
    avg_solving_time: { type: Number, default: 60 },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
