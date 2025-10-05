import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userApi from "@/api/userApi";
import type {
  UpdateProfileRequest,
  LoginRequest,
  RegisterRequest,
} from "@/types/types";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      userApi.updateUserProfile(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => userApi.updateAvatar(file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userApi.deleteUserAccount(),
    onSuccess: () => queryClient.clear(),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginRequest) => userApi.login(payload),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => userApi.register(payload),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userApi.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useLoginWithGoogle = () => {
  return useMutation({
    mutationFn: (token: string) => userApi.loginWithGoogle(token),
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: userApi.fetchAllUsers,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
