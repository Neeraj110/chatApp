import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Conversation } from "@/types/types";

interface ConversationState {
  selectedConversation: Conversation | null;
}

const initialState: ConversationState = {
  selectedConversation: sessionStorage.getItem("selectedConversation")
    ? (JSON.parse(
        sessionStorage.getItem("selectedConversation") as string
      ) as Conversation)
    : null,
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (
      state,
      action: PayloadAction<Conversation | null>
    ) => {
      state.selectedConversation = action.payload;
      if (action.payload) {
        sessionStorage.setItem(
          "selectedConversation",
          JSON.stringify(action.payload)
        );
      } else {
        sessionStorage.removeItem("selectedConversation");
      }
    },
  },
});

export const { setSelectedConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
