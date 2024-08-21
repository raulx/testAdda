import mongoose, { Schema } from 'mongoose';

const quizSchema = new Schema({
    title: { type: String },
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
