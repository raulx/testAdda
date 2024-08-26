import mongoose, { Schema } from 'mongoose';

const questionTimeSchema = new Schema({
    question_id: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    time_taken: {
        type: Number,
        required: true,
    },
});

const QuestionTime = mongoose.model('QuestionTime', questionTimeSchema);

export default QuestionTime;
