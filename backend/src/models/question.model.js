import mongoose, { Schema } from 'mongoose';

const optionSchema = new Schema({
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true },
});
const questionSchema = new Schema({
    question: { type: String, required: true, unique: true, lowercase: true },
    topic: { type: string, required: true, lowercase: true },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'moderate', 'hard'],
    },
    options: { type: optionSchema, required: true },
    explaination: { type: String, required: true },
    quiz_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        default: '', // Default value is an empty string
    },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
