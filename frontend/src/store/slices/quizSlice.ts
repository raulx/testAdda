import { QuizData, QuizQuestionsType } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { data: QuizData<QuizQuestionsType> | undefined } = {
  data: undefined,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState: initialState,
  reducers: {
    setCurrentQuiz(state, action: PayloadAction<QuizData<QuizQuestionsType>>) {
      state.data = action.payload;
    },
  },
});

export const { setCurrentQuiz } = quizSlice.actions;
export default quizSlice;
