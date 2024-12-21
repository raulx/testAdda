import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import Question from '../models/question.model.js';
import { uploadOnCloudinary } from '../services/cloudinary.services.js';
import fs from 'fs';

const addQuestion = asyncHandler(async (req, res) => {
    const {
        question_text,
        topic,
        subject,
        difficulty,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        options_type,
        explaination,
        exam,
    } = req.body;

    const {
        question_figure,
        option_a_figure,
        option_b_figure,
        option_c_figure,
        option_d_figure,
    } = req.files;

    const questionFigureFilePath = question_figure[0]?.path;

    if (
        [
            question_text,
            topic,
            subject,
            difficulty,
            exam,
            correct_option,
            explaination,
        ].some((field) => field?.trim() === '')
    ) {
        fs.unlinkSync(questionFigureFilePath);
        throw new ApiError(400, 'All fields are required !');
    }

    if (!['text', 'figure'].some((field) => field === String(options_type))) {
        fs.unlinkSync(questionFigureFilePath);
        throw new ApiError(
            400,
            'option type must be either "text" or "figure" '
        );
    }

    let questionFigure = ''; // default is empty string
    let options = { a: option_a, b: option_b, c: option_c, d: option_d }; // if options_type is text;

    //upload the question_figure_file to cloudinary and save the url of that file in backend

    if (questionFigureFilePath) {
        const uploadResponse = await uploadOnCloudinary(questionFigureFilePath);
        questionFigure = uploadResponse.url;
    }

    // if options_type is figure then upload those figures to cloudinary and save the response url in db.

    if (options_type === 'figure') {
        // if option figures are missing.
        if (
            [
                option_a_figure,
                option_b_figure,
                option_d_figure,
                option_c_figure,
            ].some((field) => field === undefined)
        ) {
            throw new ApiError(400, 'Option figures are Required !');
        }

        const optionsFigureFilePaths = {
            a: option_a_figure[0]?.path,
            b: option_b_figure[0]?.path,
            c: option_c_figure[0]?.path,
            d: option_d_figure[0]?.path,
        };

        for (let option in optionsFigureFilePaths) {
            const uploadRes = await uploadOnCloudinary(
                optionsFigureFilePaths[option]
            );
            options[option] = uploadRes.url;
        }
    }

    const newQuestionData = {
        question_text,
        topic,
        difficulty,
        subject,
        exam,
        options_type,
        correct_option,
        question_figure: questionFigure,
        explaination,
        options,
    };

    const newQuestion = await Question.create(newQuestionData);

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
