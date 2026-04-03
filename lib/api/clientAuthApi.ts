import { RegisterUser, User } from "@/types/user";
import { nextServer } from "./api";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}
interface SessionResponse {
  success: boolean;
}

export const register = async (user: RegisterData): Promise<RegisterUser> => {
  const { data } = await nextServer.post<RegisterUser>("/auth/register", user);
  return data;
};

export const login = async (user: LoginData): Promise<User> => {
  const { data } = await nextServer.post<User>("/auth/login", user);
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await nextServer.get<SessionResponse>("/auth/session");
  return data.success;
};
