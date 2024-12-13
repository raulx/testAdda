import { UserPassType } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { data: UserPassType } = {
  data: {
    _id: "",
    _v: 0,
    updatedAt: "",
    email: "",
    payment_id: "",
    amount_paid: 0,
    expires_in: "",
    createdAt: "",
  },
};
const userPassSlice = createSlice({
  name: "userpass",
  initialState: initialState,
  reducers: {
    setUserPass(state, action: PayloadAction<UserPassType>) {
      state.data = action.payload;
    },
  },
});

export const { setUserPass } = userPassSlice.actions;
export default userPassSlice;
