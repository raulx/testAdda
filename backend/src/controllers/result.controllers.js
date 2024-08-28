import asyncHandler from 'express-async-handler';
import Attempt from '../models/attempt.model.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Result from '../models/result.model.js';

//helper functions
const getCurrentRank = asyncHandler(async (userId, quizId) => {
    const attempt = await Attempt.aggregate([
        {
            $match: {
                quiz_id: mongoose.Types.ObjectId.createFromHexString(quizId),
            },
        },
        {
            $lookup: {
                from: 'results',
                localField: '_id',
                foreignField: 'attempt_id',
                as: 'result',
            },
        },
        {
            $addFields: {
                result: {
                    $first: '$result',
                },
            },
        },
        {
            $addFields: {
                marks_obtained: '$result.result.marks_obtained',
            },
        },
        {
            $sort: {
                marks_obtained: -1,
            },
        },
        {
            $group: {
                _id: '_id',
                result: {
                    $push: {
                        marks_obtained: '$marks_obtained',
                        user_id: '$user_id',
                    },
                },
            },
        },
        {
            $addFields: {
                total_attempts: { $size: '$result' },
                index: {
                    $indexOfArray: [
                        '$result.user_id',
                        mongoose.Types.ObjectId.createFromHexString(userId),
                    ],
                },
            },
        },
        {
            $project: {
                _id: 0,
                result: 0,
            },
        },
    ]);

    return {
        total_attempts: attempt[0].total_attempts,
        current_rank: attempt[0].index + 1,
    };
});

const generateReport = asyncHandler(async (attemptId) => {
    const report = await Attempt.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId.createFromHexString(attemptId),
            },
        },
        {
            $unwind: '$questions_attempted',
        },
        {
            $lookup: {
                from: 'questions',
                localField: 'questions_attempted.questionId',
                foreignField: '_id',
                as: 'question',
            },
        },
        {
            $addFields: {
                question: {
                    $first: '$question',
                },
            },
        },
        {
            $group: {
                _id: '_id',
                report: {
                    $push: {
                        questionId: '$question._id',
                        question: '$question.question',
                        topic: '$question.topic',
                        average_question_time: '$question.avg_solving_time',
                        correct_answer: '$question.correct_option',
                        answer_marked: '$questions_attempted.answerMarked',
                        time_taken: '$questions_attempted.timeTaken',
                        explaination: '$question.explaination',
                    },
                },
            },
        },
    ]);

    return report[0].report;
});

const generateResult = asyncHandler(async (attemptId) => {
    // combine the quiz questions and the attempt given by the user and generate a result for each question

    const combinedReport = await generateReport(attemptId);

    let correctAnswer = 0;

    let wrongAnswer = 0;

    let unattempted = 0;

    for (let i = 0; i < combinedReport.length; i++) {
        if (
            combinedReport[i].correct_answer === combinedReport[i].answer_marked
        )
            correctAnswer++;
        else if (combinedReport[i].answer_marked === 'unattempted')
            unattempted++;
        else wrongAnswer++;
    }

    const data = {
        correct: correctAnswer,
        wrong: wrongAnswer,
        unattempted: unattempted,
        marks_obtained: correctAnswer - wrongAnswer * 0.25,
    };
    return data;
});

// main controllers
const getResult = asyncHandler(async (req, res) => {
    const { quizId, userId } = req.body;
    // const userId = req.user._id.toString(); use this in production

    const attempt = await Attempt.findOne({
        quiz_id: mongoose.Types.ObjectId.createFromHexString(quizId),
        user_id: mongoose.Types.ObjectId.createFromHexString(userId),
    });

    const attemptId = attempt._id.toString();

    if (!attempt)
        throw new ApiError(409, 'This Quiz is not attempted by the user !');

    let resultExists = await Result.findOne({
        attempt_id: attemptId,
    }).select('result');

    if (!resultExists) resultExists = await generateResult(attemptId);

    const report = await generateReport(attemptId);

    const { total_attempts, current_rank } = await getCurrentRank(
        userId,
        quizId
    );

    res.json(
        new ApiResponse(200, {
            report: report,
            result: resultExists.result,
            standing: { current_rank, out_of: total_attempts },
            percentile_obtained:
                Math.ceil(
                    ((total_attempts - current_rank) / total_attempts) *
                        100 *
                        100
                ) / 100,
        })
    );
});

export { getResult, generateResult };
