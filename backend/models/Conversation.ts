import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  isGroup: boolean;
  groupAdmin?: mongoose.Types.ObjectId;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    groupName: {
      type: String,
      trim: true,
    },
    groupAvatar: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
