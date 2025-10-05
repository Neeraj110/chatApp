import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/types";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: sessionStorage.getItem("user")
    ? (JSON.parse(sessionStorage.getItem("user") as string) as User)
    : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("selectedConversation");
    },
  },
});

export const { setCredential, logout } = userSlice.actions;
export default userSlice.reducer;
