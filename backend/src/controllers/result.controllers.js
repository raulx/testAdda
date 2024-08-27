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
            $match: {
                result: {
                    $exists: true,
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

const generateResult = asyncHandler(async (attemptId) => {
    // combine the quiz questions and the attempt given by the user and generate a result for each question

    const combinedReport = await Attempt.aggregate([
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
                        correct_answer: '$question.correct_option',
                        answer_marked: '$questions_attempted.answerMarked',
                        time_taken: '$questions_attempted.timeTaken',
                        explaination: '$question.explaination',
                    },
                },
            },
        },
        {
            $unwind: '$report',
        },
        {
            $lookup: {
                from: 'questiontimes',
                localField: 'report.questionId',
                foreignField: 'question_id',
                as: 'q',
                pipeline: [
                    {
                        $group: {
                            _id: '_id',
                            average_time: {
                                $avg: '$time_taken',
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                average_time: {
                    $first: '$q',
                },
            },
        },
        {
            $addFields: {
                average_time_taken: '$average_time.average_time',
            },
        },
        {
            $project: {
                q: 0,
                average_time: 0,
            },
        },
        {
            $group: {
                _id: '_id',
                report: {
                    $push: {
                        questionId: '$report.questionId',
                        question: '$report.question',
                        correct_answer: '$report.correct_answer',
                        answer_marked: '$report.answer_marked',
                        user_time_taken: '$report.time_taken',
                        explaination: '$report.explaination',
                        average_question_time: '$average_time_taken',
                    },
                },
            },
        },
    ]);

    const report = combinedReport[0].report;
    let correctAnswer = 0;

    let wrongAnswer = 0;

    let unattempted = 0;

    for (let i = 0; i < report.length; i++) {
        if (report[i].correct_answer === report[i].answer_marked)
            correctAnswer++;
        else if (report[i].answer_marked === 'unattempted') unattempted++;
        else wrongAnswer++;
    }

    const data = {
        attempt_id: attemptId,
        report,

        result: {
            correct: correctAnswer,
            wrong: wrongAnswer,
            unattempted: unattempted,
            marks_obtained: correctAnswer - wrongAnswer * 0.25,
        },
    };

    return await Result.create(data);
});

// main controllers
const getResult = asyncHandler(async (req, res) => {
    const { quizId, userId } = req.body;
    // const userId = req.user._id.toString(); use this in production

    const attempt = await Attempt.findOne({
        user_id: mongoose.Types.ObjectId.createFromHexString(userId),
        quiz_id: mongoose.Types.ObjectId.createFromHexString(quizId),
    });

    const attemptId = attempt._id.toString();

    if (!attempt)
        throw new ApiError(409, 'This Quiz is not attempted by the user !');

    // check if result is already generated for the attempt,

    const resultExists = await Result.findOne({
        attempt_id: attemptId,
    });

    if (resultExists) {
        const { total_attempts, current_rank } = await getCurrentRank(
            userId,
            quizId
        );

        const newData = {
            attempt_id: attempt._id,
            report: resultExists.report,
            result: resultExists.result,
            standing: { current_rank, out_of: total_attempts },
            percentile_obtained:
                ((total_attempts - current_rank) / total_attempts) * 100,
        };
        return res.json(
            new ApiResponse(200, newData, `Result for quizId ${quizId}`)
        );
    }

    // if result does not exist for the attempt then generate the result and save to the result modlel.
    const newResult = await generateResult(attemptId);

    const { total_attempts, current_rank } = await getCurrentRank(
        userId,
        quizId
    );

    // note->add total_attempts and current_rank to the response data.
    res.json(
        new ApiResponse(
            200,
            {
                attempt_id: attempt._id,
                report: newResult.report,
                result: newResult.report,
                standing: { current_rank, out_of: total_attempts },
                percentile_obtained:
                    ((total_attempts - current_rank) / total_attempts) * 100,
            },
            `Result for quidId ${quizId}`
        )
    );
});

export { getResult };
