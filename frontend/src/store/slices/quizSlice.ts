import { QuizData } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { data: QuizData | undefined } = {
  data: undefined,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState: initialState,
  reducers: {
    setCurrentQuiz(state, action: PayloadAction<QuizData>) {
      state.data = action.payload;
    },
  },
});

export const { setCurrentQuiz } = quizSlice.actions;
export default quizSlice;
