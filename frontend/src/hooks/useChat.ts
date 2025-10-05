import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as chatApi from "@/api/chatApi";
import type {
  CreateGroupRequest,
  UpdateGroupRequest,
  AddGroupMembersRequest,
  RemoveGroupMembersRequest,
} from "@/types/types";

export const useMessages = (conversationId: string) =>
  useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => chatApi.getMessages(conversationId),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!conversationId,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => chatApi.sendMessage(formData),
    onSuccess: (_, payload) => {
      const conversationId =
        payload instanceof FormData
          ? (payload.get("conversationId") as string)
          : undefined;

      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", conversationId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipientId: string) => chatApi.startConversation(recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useConversations = () =>
  useQuery({
    queryKey: ["conversations"],
    queryFn: chatApi.getConversations,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) =>
      chatApi.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// export const useDeleteMessage = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       messageId,
//       conversationId,
//     }: {
//       messageId: string;
//       conversationId: string;
//     }) => chatApi.deleteMessage(messageId),
//     onSuccess: (_, { conversationId }) => {
//       queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
//       queryClient.invalidateQueries({ queryKey: ["conversations"] });
//     },
//   });
// };

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupRequest) => {
      const sanitizedPayload = {
        ...payload,
        groupAvatar: payload.groupAvatar ?? undefined,
      };
      return chatApi.createGroup(sanitizedPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateGroupRequest) => {
      const sanitizedPayload = {
        ...payload,
        groupAvatar: payload.groupAvatar ?? undefined,
      };
      return chatApi.updateGroup(sanitizedPayload);
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", payload.conversationId],
      });
    },
  });
};

export const useAddGroupMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddGroupMembersRequest) =>
      chatApi.addGroupMembers(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", payload.conversationId],
      });
    },
  });
};

export const useRemoveGroupMembers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RemoveGroupMembersRequest) =>
      chatApi.removeGroupMembers(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", payload.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => chatApi.deleteGroup(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
