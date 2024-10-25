import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllQuestion, QuestionData } from "../apis/questionApis";

type InitialStateType = {
  data: AllQuestion;
};
const initialState: InitialStateType = {
  data: [
    {
      avg_solving_time: "",
      correct_option: "",
      createdAt: "",
      difficulty: "",
      explaination: "",
      options: { a: "", b: "", c: "", d: "" },
      question: "",
      subject: "",
      topic: "",
      quiz_id: "",
      updatedAt: "",
      _id: "",
      __v: 0,
    },
  ],
};


const questionsSlice = createSlice({
  name: "Questions",
  initialState: initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<AllQuestion>) {
      state.data = action.payload;
    },
    addNewQuestion(state, action: PayloadAction<QuestionData>) {
      state.data.push(action.payload);
    },
    dropQuestion(state, action: PayloadAction<string>) {
      state.data = state.data.filter((d) => d._id != action.payload);
    },
  },
});

export const { setQuestions, addNewQuestion, dropQuestion } =
  questionsSlice.actions;

export default questionsSlice;
