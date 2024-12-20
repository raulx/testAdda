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
        exam,
    } = req.body;

    if (
        [
            question,
            topic,
            subject,
            difficulty,
            exam,
            correct_option,
            explaination,
        ].some((field) => field?.trim() === '') ||
        options == {}
    ) {
        throw new ApiError(400, 'All fields are required !');
    }

    const newQuestion = await Question.create({
        question: question,
        topic: topic,
        subject: subject,
        difficulty: difficulty,
        options: options,
        correct_option: correct_option,
        explaination: explaination,
        exam: exam,
    });
    res.json(new ApiResponse(200, newQuestion, 'Question added successfully'));
});

const getAllQuestions = asyncHandler(async (req, res) => {
    const question = await Question.find({});

    res.json(new ApiResponse(200, question, 'All questions'));
});

const removeQuestion = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!_id) new ApiError(400, 'Question Id is required');

    const question = await Question.findById({ _id: _id });

    if (question.quiz_id)
        throw new ApiError(
            409,
            "Question is present in a quiz, can't be deleted"
        );

    await Question.findByIdAndDelete({ _id: _id });

    res.json(new ApiResponse(200, question, 'question deleted successfully'));
});

const questionSearch = asyncHandler(async (req, res) => {
    const { questionText } = req.query;

    let foundQuestion;
    if (questionText === '') {
        foundQuestion = await Question.find({});
    } else {
        foundQuestion = await Question.aggregate([
            {
                $match: {
                    question: { $regex: questionText, $options: 'i' },
                },
            },
        ]);
    }
    res.json(new ApiResponse(200, foundQuestion, 'questions present by query'));
});

export { addQuestion, getAllQuestions, removeQuestion, questionSearch };
