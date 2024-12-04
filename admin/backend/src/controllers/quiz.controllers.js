import Question from '../models/question.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Test from '../models/test.model.js';
import asynchandler from 'express-async-handler';

const addTest = asynchandler(async (req, res) => {
    const {
        title,
        description,
        duration,
        difficulty_level,
        questions,
        access_type,
    } = req.body;

    if (
        [title, description, difficulty_level, access_type].some(
            (field) => field?.trim() === ''
        ) ||
        questions?.length === 0 ||
        duration === 0
    )
        throw new ApiError(400, 'All fields Are Required !');

    for (let i = 0; i < questions.length; i++) {
        const question = await Question.findById({ _id: questions[i] });
        if (!question) throw new ApiError(409, 'Questions are not available');
        else if (question.quiz_id)
            throw new ApiError(409, 'Question is already present in a quiz.');
    }

    const newQuiz = await Test.create({
        title,
        description,
        duration,
        difficulty_level,
        questions,
        access_type,
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

const getTests = asynchandler(async (req, res) => {
    const quizes = await Test.aggregate([
        {
            $lookup: {
                from: 'questions',
                localField: 'questions',
                foreignField: '_id',
                as: 'questions',
            },
        },
    ]);
    res.json(new ApiResponse(200, quizes, 'Quizes available !'));
});

const deleteTest = asynchandler(async (req, res) => {
    const { quiz_id } = req.body;

    const quiz = await Test.findOne({ _id: quiz_id });
    if (!quiz) throw new ApiError(404, 'Quiz not found');

    for (let i = 0; i < quiz.questions.length; i++) {
        await Question.findOneAndUpdate(
            { _id: quiz.questions[i]._id },
            { $unset: { quiz_id: '' } }
        );
    }
    await Test.findOneAndDelete({ _id: quiz._id });

    res.json(new ApiResponse(200, {}, 'quiz deleted successfully'));
});
export { addTest, getTests, deleteTest };
