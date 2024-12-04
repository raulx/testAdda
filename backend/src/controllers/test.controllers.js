import asynchandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import Test from '../models/test.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Question from '../models/question.model.js';
import mongoose from 'mongoose';
import TestProgress from '../models/testprogress.model.js';

const addTest = asynchandler(async (req, res) => {
    const {
        title,
        description,
        duration,
        difficultyLevel,
        questions,
        accessType,
    } = req.body;

    if (
        [title, description, difficultyLevel, accessType].some(
            (field) => field?.trim() === ''
        ) ||
        questions?.length === 0 ||
        duration === 0
    )
        throw new ApiError(400, 'All fields Are Required !');

    for (let i = 0; i < questions.length; i++) {
        const available = await Question.findById({ _id: questions[i] });
        if (!available) throw new ApiError(409, 'Questions are not available');
    }

    const newQuiz = await Test.create({
        title,
        description,
        duration,
        difficulty_level: difficultyLevel,
        questions,
        access_type: accessType,
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

const removeTest = asynchandler(async (req, res) => {
    const { quiz_id } = req.body;

    if (!quiz_id) throw new ApiError(400, 'All fields are required');

    const quizTobeDeleted = await Test.findOne({ _id: quiz_id });

    if (!quizTobeDeleted) throw new ApiError(404, 'Quiz not found !');

    const quizTobeDeletedQuestion = quizTobeDeleted.questions;

    for (let i = 0; i < quizTobeDeletedQuestion.length; i++) {
        await Question.findOneAndUpdate(
            { _id: quizTobeDeletedQuestion[i] },
            { $unset: { quiz_id: '' } }
        );
    }

    await Test.findByIdAndDelete({ _id: quiz_id });

    res.json(new ApiResponse(200, {}, 'Quiz Removed Successfully !'));
});

const getTests = asynchandler(async (req, res) => {
    const user = req.user;

    const quizes = await Test.find({});

    res.json(new ApiResponse(200, quizes, 'Quizes available !'));
});

const getTest = asynchandler(async (req, res) => {
    const { quiz_id } = req.query;

    const quiz = await Test.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId.createFromHexString(quiz_id),
            },
        },
        {
            $lookup: {
                from: 'questions',
                localField: 'questions',
                foreignField: '_id',
                as: 'questions',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            options: 1,
                            question: 1,
                            subject: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                __v: 0,
            },
        },
    ]);

    if (!quiz) throw new ApiError(404, 'Quiz not Found');
    res.json(new ApiResponse(200, quiz, 'Quiz Data successfully sent'));
});

const saveTestProgress = asynchandler(async (req, res) => {
    const data = req.body;
    const user = req.user;
    if (!data) throw new ApiError(400, 'All Fields are required');

    const testProgress = await TestProgress.findOne({
        quizId: data.quizId,
        userId: user._id,
    });

    if (testProgress) {
        testProgress.questionsAttempted = data.questionsAttempted;
        testProgress.onQuestionNumber = data.onQuestionNumber;
        testProgress.timeRemaining = data.timeRemaining;
        await testProgress.save();
    } else {
        await TestProgress.create({ userId: user._id, ...data });
    }
    res.json(new ApiResponse(200, {}, 'quiz save successfully'));
});

const getTestProgress = asynchandler(async (req, res) => {
    const { quizId } = req.query;
    const user = req.user;

    const testProgress = await TestProgress.findOne({
        quizId,
        userId: user._id,
    });

    if (testProgress)
        res.json(
            new ApiResponse(
                200,
                testProgress,
                'quiz progress fetched successfully'
            )
        );
    else throw new ApiError(404, 'Quiz Progess Not Found !');
});

export {
    addTest,
    removeTest,
    getTests,
    getTest,
    saveTestProgress,
    getTestProgress,
};
