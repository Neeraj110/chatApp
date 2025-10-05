export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  authType: "local" | "google";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  message: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export type MessageType = "text" | "image" | "video";

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  messageType: MessageType;
  content: string;
  fileId?: string;
  createdAt: string;
  updatedAt: string;
  status?: "sent" | "delivered" | "read";
}

export interface PopulatedMessage {
  _id: string;
  conversationId: Conversation;
  sender: User;
  messageType: MessageType;
  content: string;
  fileId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  conversationId?: string;
  content?: string;
}

export interface SendMessageResponse {
  success: true;
  message: string;
  data: PopulatedMessage;
}

export interface GetMessagesResponse {
  success: true;
  messages: Message[];
}

export interface Participant {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LastMessage {
  _id: string;
  content: string;
  sender: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  participants: Participant | Participant[];
  lastMessage?: LastMessage;
  updatedAt: string;
  createdAt: string;
}

export interface GroupAdmin {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BaseConversation {
  _id: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: LastMessage | null;
}

export interface SingleChatConversation extends BaseConversation {
  isGroup: false;
  participants: Participant;
}

// Group chat conversation
export interface GroupChatConversation extends BaseConversation {
  isGroup: true;
  participants: Participant[];
  groupName: string;
  groupAvatar?: string;
  groupAdmin: GroupAdmin;
  participantsCount: number;
}

export type ConversationWithPopulatedData =
  | SingleChatConversation
  | GroupChatConversation;

export const isSingleChat = (
  conversation: ConversationWithPopulatedData
): conversation is SingleChatConversation => {
  return !conversation.isGroup;
};

export const isGroupChat = (
  conversation: ConversationWithPopulatedData
): conversation is GroupChatConversation => {
  return conversation.isGroup;
};

export interface CreateGroupRequest {
  groupName: string;
  participants: string[];
  groupAvatar?: File | null;
}

export interface CreateGroupResponse {
  success: true;
  message: string;
  conversation: Conversation;
}

export interface AddGroupMembersRequest {
  conversationId: string;
  participants: string[]; // User IDs to add
}

export interface RemoveGroupMembersRequest {
  conversationId: string;
  participants: string[]; // User IDs to remove
}

export interface UpdateGroupRequest {
  conversationId: string;
  groupName?: string;
  groupAvatar?: File | null;
}

export interface GroupManagementResponse {
  success: true;
  message: string;
  conversation: Conversation;
}

// File Upload Types
export interface FileUploadResponse {
  success: true;
  message: string;
  url: string;
  publicId: string;
}
