import { UpdateUserProfile, User } from "@/types/user";
import { nextServer } from "./api";

interface UpdateProfileData {
  name?: string;
  currency?: string;
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
