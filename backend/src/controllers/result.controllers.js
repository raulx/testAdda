import asyncHandler from 'express-async-handler';
import Attempt from '../models/attempt.model.js';
import mongoose from 'mongoose';

const getResult = asyncHandler(async (req, res) => {
    const { attemptId } = req.body;

    const attempt = await Attempt.findById({ _id: attemptId });

    const attemptMatch = await Attempt.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId.createFromHexString(
                    '66ca18c11124cb26e15070f5'
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

    const data = {
        quizId: attempt.quiz_id,
        userId: attempt.user_id,
        result,
        report: {
            correctAnswer: correctAnswer,
            wrongAnswer: wrongAnswer,
            unattempted: unattempted,
            marksObtained: correctAnswer - wrongAnswer * 0.25,
            totalMarks: result.length,
        },
    };
    res.json({
        status: 200,
        data: data,
        message: 'here are your results',
    });
});

export { getResult };
