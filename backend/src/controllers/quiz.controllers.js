import asynchandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import Quiz from '../models/quiz.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Question from '../models/question.model.js';

const addQuiz = asynchandler(async (req, res) => {
    const { title, description, duration, difficulty_level, questions } =
        req.body;

    if (
        [title, description, difficulty_level].some(
            (field) => field?.trim() === ''
        ) ||
        questions?.length === 0 ||
        duration === 0
    )
        throw new ApiError(400, 'All fields must have value !');

    const newQuiz = await Quiz.create({
        title,
        description,
        duration,
        difficulty_level,
        questions,
    });

    const newQuizQuestions = newQuiz.questions;

    //update all the questions quiz_id field.
    for (let i = 0; i < newQuizQuestions.length; i++) {
        await Question.findByIdAndUpdate(
            { _id: newQuizQuestions[i] },
            { $set: { quiz_id: newQuiz._id } }
        );
    }

    res.json(new ApiResponse(200, newQuiz, 'Quiz added successfully'));
});

const removeQuiz = asynchandler(async (req, res) => {
    const { quiz_id } = req.body;

    if (!quiz_id) throw new ApiError(400, 'All fields are required');

    const quizTobeDeleted = await Quiz.findOne({ _id: quiz_id });

    if (!quizTobeDeleted) throw new ApiError(404, 'Quiz not found !');

    const quizTobeDeletedQuestion = quizTobeDeleted.questions;

    for (let i = 0; i < quizTobeDeletedQuestion.length; i++) {
        await Question.findOneAndUpdate(
            { _id: quizTobeDeletedQuestion[i] },
            { $unset: { quiz_id: '' } }
        );
    }

    await Quiz.findByIdAndDelete({ _id: quiz_id });

    res.json(new ApiResponse(200, {}, 'Quiz Removed Successfully !'));
});
export { addQuiz, removeQuiz };
