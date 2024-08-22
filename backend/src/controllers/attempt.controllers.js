import asyncHandler from 'express-async-handler';

const attemptQuiz = asyncHandler(async (req, res) => {
    res.json({ status: 200, message: 'successfully attempted the quiz' });
});

export { attemptQuiz };
