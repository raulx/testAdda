import { UserData } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userInitialState: { data: UserData } = {
  data: {
    _id: "",
    email: "",
    username: "",
    avatar_url: "",
    is_subscribed: false,
    test_attempted: [],
    paused_tests: [],
    createdAt: "",
    updatedAt: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.data = action.payload;
    },
    updateUserName(state, action: PayloadAction<string>) {
      if (state.data) state.data.username = action.payload;
    },
    updateUserAvatar(state, action: PayloadAction<string>) {
      if (state.data) state.data.avatar_url = action.payload;
    },
  },
});

export const { setUser, updateUserName, updateUserAvatar } = userSlice.actions;

export default userSlice;
