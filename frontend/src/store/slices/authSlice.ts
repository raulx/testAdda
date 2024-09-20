import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthStateType {
  isLoggedIn: boolean;
  _id: string;
}

const AuthInitialState: { data: AuthStateType } = {
  data: {
    isLoggedIn: localStorage.getItem("auth") ? true : false,
    _id: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: AuthInitialState,
  reducers: {
    logInUser(state, action: PayloadAction<string>) {
      //auth item represents user is logged in.
      localStorage.setItem(
        "auth",
        JSON.stringify({ isLoggedIn: true, _id: action.payload })
      );
      // refresh item represents that login refresh is available.
      localStorage.setItem(
        "refresh",
        JSON.stringify({ isRefreshAvailable: true, _id: action.payload })
      );
      state.data._id = action.payload;
      state.data.isLoggedIn = true;
    },
    logOutUser(state) {
      localStorage.removeItem("auth");
      localStorage.removeItem("refresh");
      state.data._id = "";
      state.data.isLoggedIn = false;
    },
  },
});

export const { logInUser, logOutUser } = authSlice.actions;

export default authSlice;
