import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import Question from '../models/question.model.js';

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

export { addQuestion };
