import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuizesResponseType } from "@/utils/types";

interface quizesSliceType {
  data: QuizesResponseType | null;
}

const quizesInitialState: quizesSliceType = {
  data: null,
};

const quizesSlice = createSlice({
  name: "quizes",
  initialState: quizesInitialState,
  reducers: {
    setQuizes(state, action: PayloadAction<QuizesResponseType>) {
      state.data = action.payload;
    },
  },
});

export const { setQuizes } = quizesSlice.actions;
export default quizesSlice;
