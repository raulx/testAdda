import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import Attempt from '../models/attempt.model.js';
import Quiz from '../models/quiz.model.js';
import QuestionTime from '../models/question.time.model.js';
import { generateResult } from './result.controllers.js';
import Result from '../models/result.model.js';

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

    //save the time taken by user to solve each question in questionTime model.

    questionsAttempted.forEach(async (value) => {
        await QuestionTime.create({
            question_id: value.questionId,
            time_taken: value.timeTaken,
        });
    });

    //generate the result and save it to result collection.

    const attemptId = newAttempt._id.toString();
    const resultGenerated = await generateResult(attemptId);

    const newResult = {
        attempt_id: attemptId,
        quiz_id: quizId,
        result: resultGenerated,
    };
    await Result.create(newResult);

    res.json(new ApiResponse(200, newAttempt, 'Quiz attempted successfully !'));
});

export { attemptQuiz };
