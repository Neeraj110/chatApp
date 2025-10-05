import api from "./api";
import type {
  GetMessagesResponse,
  CreateGroupRequest,
  CreateGroupResponse,
  AddGroupMembersRequest,
  RemoveGroupMembersRequest,
  UpdateGroupRequest,
} from "@/types/types";

export const sendMessage = async (formData: FormData) => {
  try {
    const { data } = await api.post("/messages/send", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Send message error:", error);
    throw error;
  }
};

export const getMessages = async (
  conversationId: string
): Promise<GetMessagesResponse> => {
  try {
    const { data } = await api.get<GetMessagesResponse>(
      `/messages/${conversationId}`
    );
    return data;
  } catch (error) {
    console.error("Get messages error:", error);
    throw error;
  }
};

export const startConversation = async (recipientId: string) => {
  try {
    const { data } = await api.post("/messages/startConversation", {
      recipientId,
    });
    return data;
  } catch (error) {
    console.error("Start conversation error:", error);
    throw error;
  }
};

export const getConversations = async () => {
  try {
    const { data } = await api.get("/messages/getConversations");
    return data;
  } catch (error) {
    console.error("Get conversations error:", error);
    throw error;
  }
};

export const deleteConversation = async (conversationId: string) => {
  try {
    const { data } = await api.delete(`/messages/${conversationId}`);
    return data;
  } catch (error) {
    console.error("Delete conversation error:", error);
    throw error;
  }
};

export const createGroup = async (
  payload: CreateGroupRequest & { groupAvatar?: File }
): Promise<CreateGroupResponse> => {
  try {
    let response;

    if (payload.groupAvatar) {
      const formData = new FormData();
      formData.append("groupName", payload.groupName);
      payload.participants.forEach((id) => formData.append("participants", id));
      formData.append("groupAvatar", payload.groupAvatar);

      response = await api.post<CreateGroupResponse>(
        "/messages/group",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      response = await api.post<CreateGroupResponse>(
        "/messages/group",
        payload
      );
    }

    return response.data;
  } catch (error) {
    console.error("Create group error:", error);
    throw error;
  }
};

export const updateGroup = async (
  payload: UpdateGroupRequest & { groupAvatar?: File }
) => {
  try {
    if (payload.groupAvatar) {
      const formData = new FormData();
      formData.append("conversationId", payload.conversationId);
      if (payload.groupAvatar)
        formData.append("groupAvatar", payload.groupAvatar);
      if (payload.groupName) formData.append("groupName", payload.groupName);
      await api.patch(`/messages/group`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      const { data } = await api.patch<CreateGroupResponse>(
        "/messages/group",
        payload
      );
      return data;
    }
  } catch (error) {
    console.error("Update group error:", error);
    throw error;
  }
};

export const addGroupMembers = async (payload: AddGroupMembersRequest) => {
  try {
    const { data } = await api.patch<CreateGroupResponse>(
      "/messages/group/members/add",
      payload
    );
    return data;
  } catch (error) {
    console.error("Add group members error:", error);
    throw error;
  }
};

export const removeGroupMembers = async (
  payload: RemoveGroupMembersRequest
) => {
  try {
    const { data } = await api.patch<CreateGroupResponse>(
      "/messages/group/members/remove",
      payload
    );
    return data;
  } catch (error) {
    console.error("Remove group members error:", error);
    throw error;
  }
};

export const deleteGroup = async (conversationId: string) => {
  try {
    const { data } = await api.delete(`/messages/group/${conversationId}`);
    return data;
  } catch (error) {
    console.error("Delete group error:", error);
    throw error;
  }
};
