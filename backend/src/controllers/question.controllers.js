import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import Question from '../models/question.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addQuestion = asyncHandler(async (req, res) => {
    const {
        question,
        topic,
        subject,
        difficulty,
        options,
        correct_option,
        explaination,
    } = req.body;

    if (
        [
            question,
            topic,
            subject,
            difficulty,

            correct_option,
            explaination,
        ].some((field) => field?.trim() === '') ||
        options == {}
    ) {
        throw new ApiError(400, 'All fields are required !');
    }

    const questionExists = await Question.findOne({ question: question });

    if (questionExists)
        throw new ApiError(409, 'This question already exists !');

    const newQuestion = await Question.create({
        question: question,
        topic: topic,
        subject: subject,
        difficulty: difficulty,
        options: options,
        correct_option: correct_option,
        explaination: explaination,
    });
    res.json(new ApiResponse(200, newQuestion, 'Question added successfully'));
});

const getAvailableQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find({ quiz_id: { $exists: false } });
    res.json(
        new ApiResponse(
            200,
            {
                total_available_questions: questions.length,
                questions: questions,
            },
            'These are the questions that are available for quiz creation.'
        )
    );
});

const removeQuestion = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!_id) new ApiError(400, 'All fields are required');

    const question = await Question.findById({ _id: _id });

    if (question.quiz_id)
        throw new ApiError(
            409,
            "Question is present in a quiz, can't be deleted"
        );

    await Question.findByIdAndDelete({ _id: _id });

    res.json(new ApiResponse(200, {}, 'question deleted successfully'));
});

export { addQuestion, getAvailableQuestions, removeQuestion };
