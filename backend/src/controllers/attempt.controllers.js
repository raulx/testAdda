import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import Attempt from '../models/attempt.model.js';
import Quiz from '../models/quiz.model.js';

const attemptQuiz = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { quizId, questionsAttempted } = req.body;

    if (!quizId || !questionsAttempted)
        throw new ApiError(401, 'All fields are required !');

    const attemptExists = await Attempt.findOne({
        user_id: userId,
        quiz_id: quizId,
    });

    if (attemptExists)
        throw new ApiError(409, 'This Quiz is already attempted by the user');

    // check if the question attempted matches with the questions present in the quiz.

    const quiz = await Quiz.findById({ _id: quizId });

    if (!quiz) throw new ApiError(404, 'Quiz not found !');

    const quizQuestions = quiz.questions.map((ques) => ques.toString());

    const questionsAttemptedIds = questionsAttempted.map(
        (ques) => ques.questionId
    );

    for (let i = 0; i < questionsAttemptedIds.length; i++) {
        if (!quizQuestions.includes(questionsAttemptedIds[i]))
            throw new ApiError(
                409,
                ' ERROR:BAD REQUEST -> Questions attempted did not match with questions present in the quiz.'
            );
    }

    const newAttemptData = {
        user_id: userId,
        quiz_id: quizId,
        questions_attempted: questionsAttempted,
    };

    const newAttempt = await Attempt.create(newAttemptData);
    res.json(new ApiResponse(200, newAttempt, 'Quiz attempted successfully !'));
});

export { attemptQuiz };
