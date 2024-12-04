import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TestsResponseType } from "@/utils/types";

interface quizesSliceType {
  data: TestsResponseType | null;
}

const quizesInitialState: quizesSliceType = {
  data: null,
};

const quizesSlice = createSlice({
  name: "quizes",
  initialState: quizesInitialState,
  reducers: {
    setQuizes(state, action: PayloadAction<TestsResponseType>) {
      state.data = action.payload;
    },
  },
});

export const { setQuizes } = quizesSlice.actions;
export default quizesSlice;
