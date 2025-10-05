import api, { uploadFile } from "./api";
import type {
  ApiResponse,
  AuthResponse,
  UpdateProfileRequest,
  RegisterRequest,
  User,
} from "@/types/types";

export const register = async (
  payload: RegisterRequest
): Promise<AuthResponse> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/users/register",
    payload
  );

  return data.data!;
};

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await api.post<ApiResponse<User>>("/users/login", payload);
  return data.data!;
};

export const loginWithGoogle = async (token: string): Promise<User> => {
  const { data } = await api.post<ApiResponse<User>>("/users/google-login", {
    code: token,
  });
  return data.data!;
};

export const fetchUserProfile = async (): Promise<User> => {
  const { data } = await api.get<ApiResponse<User>>("/users/profile");
  return data.data!;
};

export const updateUserProfile = async (
  payload: UpdateProfileRequest
): Promise<User> => {
  const { data } = await api.patch<ApiResponse<User>>(
    "/users/profile",
    payload
  );
  return data.data!;
};

export const updateAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const data = await uploadFile("/users/avatar", formData);
  return data.data!;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>("/users/logout");
  return data;
};

export const deleteUserAccount = async (): Promise<ApiResponse<null>> => {
  const { data } = await api.delete<ApiResponse<null>>("/users/account");
  return data;
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<ApiResponse<User[]>>("/users/allUsers");
  return data.data || [];
};
