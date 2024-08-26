import asyncHandler from 'express-async-handler';
import Attempt from '../models/attempt.model.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Result from '../models/result.model.js';

// const generateResult = asyncHandler(async (attemptId) => {
//     const attemptMatch = await Attempt.aggregate([
//         {
//             $match: {
//                 _id: attemptId,
//             },
//         },

//         { $unwind: '$questions_attempted' },
//         {
//             $lookup: {
//                 from: 'questions',
//                 localField: 'questions_attempted.questionId',
//                 foreignField: '_id',
//                 as: 'question',
//             },
//         },
//         {
//             $addFields: {
//                 question: { $first: '$question' },
//             },
//         },
//         {
//             $group: {
//                 _id: '_id',
//                 result: {
//                     $push: {
//                         questionId: '$question._id',
//                         question: '$question.question',
//                         correct_answer: '$question.correct_option',
//                         answer_marked: '$questions_attempted.answerMarked',
//                         time_taken: '$questions_attempted.timeTaken',
//                         explaination: '$question.explaination',
//                     },
//                 },
//             },
//         },
//     ]);

//     const result = attemptMatch[0].result;
//     let correctAnswer = 0;

//     let wrongAnswer = 0;

//     let unattempted = 0;

//     for (let i = 0; i < result.length; i++) {
//         if (result[i].correct_answer === result[i].answer_marked)
//             correctAnswer++;
//         else if (result[i].answer_marked === 'unattempted') unattempted++;
//         else wrongAnswer++;
//     }

//     return {
//         result,
//         report: {
//             correctAnswer: correctAnswer,
//             wrongAnswer: wrongAnswer,
//             unattempted: unattempted,
//             marksObtained: correctAnswer - wrongAnswer * 0.25,
//             totalMarks: result.length,
//         },
//     };
// });

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
            $match: {
                result: {
                    $exists: true,
                },
            },
        },
        {
            $addFields: {
                marks_obtained: '$result.report.marks_obtained',
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
                total_attempts: {
                    $size: '$result',
                },
                current_rank: {
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
        current_rank: attempt[0].current_rank + 1,
    };
});

const getResult = asyncHandler(async (req, res) => {
    const { quizId, userId } = req.body;
    // const { _id } = req.user use _id from cookie as userId in production.

    const attempt = await Attempt.findOne({
        user_id: mongoose.Types.ObjectId.createFromHexString(userId),
        quiz_id: mongoose.Types.ObjectId.createFromHexString(quizId),
    });

    if (!attempt)
        throw new ApiError(409, 'This Quiz is not attempted by the user !');

    const existingResult = await Result.findOne({
        attempt_id: attempt._id.toString(),
    });

    if (existingResult) {
        const { total_attempts, current_rank } = await getCurrentRank(
            userId,
            quizId
        );

        const newData = { total_attempts, current_rank, existingResult };
        return res.json(
            new ApiResponse(200, newData, `Result for quizId ${quizId}`)
        );
    }

    const attemptMatch = await Attempt.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId.createFromHexString(
                    attempt._id.toString()
                ),
            },
        },

        { $unwind: '$questions_attempted' },
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
                question: { $first: '$question' },
            },
        },
        {
            $group: {
                _id: '_id',
                result: {
                    $push: {
                        questionId: '$question._id',
                        question: '$question.question',
                        correct_answer: '$question.correct_option',
                        answer_marked: '$questions_attempted.answerMarked',
                        time_taken: '$questions_attempted.timeTaken',
                        explaination: '$question.explaination',
                    },
                },
            },
        },
    ]);

    const result = attemptMatch[0].result;
    let correctAnswer = 0;

    let wrongAnswer = 0;

    let unattempted = 0;

    for (let i = 0; i < result.length; i++) {
        if (result[i].correct_answer === result[i].answer_marked)
            correctAnswer++;
        else if (result[i].answer_marked === 'unattempted') unattempted++;
        else wrongAnswer++;
    }

    const { total_attempts, current_rank } = await getCurrentRank(
        userId,
        quizId
    );
    const data = {
        attempt_id: attempt._id,
        result,
        total_attempts,
        current_rank,
        report: {
            correct: correctAnswer,
            wrong: wrongAnswer,
            unattempted: unattempted,
            marks_obtained: correctAnswer - wrongAnswer * 0.25,
        },
    };

    const newResult = await Result.create(data);
    res.json(new ApiResponse(200, newResult, 'Here is your first result !'));
});

export { getResult };
