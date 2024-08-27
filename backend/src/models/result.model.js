import mongoose, { Schema } from 'mongoose';

const resultSchema = new Schema({
    attempt_id: {
        type: Schema.Types.ObjectId,
        ref: 'Attempt',
        required: true,
        unique: true,
    },
    report: [
        {
            questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
            question: { type: String },
            correct_answer: { type: String },
            answer_marked: { type: String },
            user_time_taken: { type: Number },
            explaination: { type: String },
            average_question_time: { type: Number },
        },
    ],
    result: {
        correct: { type: Number },
        wrong: { type: Number },
        unattempted: { type: Number },
        marks_obtained: { type: Number },
    },
    total_marks: { type: Number },
});

resultSchema.pre('save', function (next) {
    this.total_marks = this.result.length;
    next();
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
