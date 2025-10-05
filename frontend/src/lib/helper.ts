import {
  isGroupChat,
  type ConversationWithPopulatedData,
  isSingleChat,
} from "@/types/types";

export const getConversationName = (
  conversation: ConversationWithPopulatedData
): string => {
  if (isSingleChat(conversation)) {
    return conversation.participants.name;
  }
  return conversation.groupName;
};

export const getConversationAvatar = (
  conversation: ConversationWithPopulatedData
): string => {
  if (isSingleChat(conversation)) {
    return conversation.participants.avatar || "";
  }
  return conversation.groupAvatar || "";
};

export const getConversationUserId = (
  conversation: ConversationWithPopulatedData
): string => {
  if (isSingleChat(conversation)) {
    return conversation.participants._id;
  }
  return "";
};

export const getConversationParticipants = (
  conversation: ConversationWithPopulatedData
) => {
  if (isSingleChat(conversation)) {
    return [conversation.participants];
  }
  return conversation.participants;
};

export const getGroupAdmin = (conversation: ConversationWithPopulatedData) => {
  if (isGroupChat(conversation)) {
    return conversation.groupAdmin;
  }
  return null;
};

export const getGroupParticipantCount = (
  conversation: ConversationWithPopulatedData
) => {
  if (isGroupChat(conversation)) {
    return conversation.participantsCount;
  }
  return 0;
};

export const getConversationEmail = (
  conversation: ConversationWithPopulatedData
): string => {
  if (isSingleChat(conversation)) {
    return conversation.participants.email;
  }
  return "";
};
