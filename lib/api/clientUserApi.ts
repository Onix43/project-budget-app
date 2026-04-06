import { UpdateUserProfile, User } from "@/types/user";
import { nextServer } from "./api";

interface UpdateProfileData {
  name?: string;
  currency?: string;
}

interface AvatarResponse {
  avatarUrl: string;
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/current");
  return data;
};

export const updateUserProfile = async (
  updatedUser: UpdateProfileData,
): Promise<UpdateUserProfile> => {
  const { data } = await nextServer.patch<UpdateUserProfile>(
    "/users/info",
    updatedUser,
  );
  return data;
};

export const updateUserAvatar = async (
  avatar: File,
): Promise<AvatarResponse> => {
  const formData = new FormData();
  formData.append("avatar", avatar);

  const { data } = await nextServer.patch<AvatarResponse>(
    "/users/avatar",
    formData,
  );
  return data;
};

export const deleteUserAvatar = async (): Promise<void> => {
  await nextServer.delete("/users/avatar");
};
