import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuizResponseType } from "@/utils/types";

interface quizesSliceType {
  data: QuizResponseType | null;
}

const quizesInitialState: quizesSliceType = {
  data: null,
};

const quizesSlice = createSlice({
  name: "quizes",
  initialState: quizesInitialState,
  reducers: {
    setQuizes(state, action: PayloadAction<QuizResponseType>) {
      state.data = action.payload;
    },
  },
});

export const { setQuizes } = quizesSlice.actions;
export default quizesSlice;
