import asynchandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import Quiz from '../models/quiz.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addQuiz = asynchandler(async (req, res) => {
    const { title } = req.body;

    if (!title) throw new ApiError(401, 'All fields are required !');

    const newQuiz = await Quiz.create({ title });

    res.json(new ApiResponse(200, newQuiz, 'Quiz added successfully'));
});

export default addQuiz;
