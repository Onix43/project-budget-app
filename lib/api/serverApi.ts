import { cookies } from "next/headers";
import { nextServer } from "./api";
import { SessionResponse } from "./clientAuthApi";
import { User } from "@/types/user";
import { CategoryStats } from "@/types/category";
import {
  TransactionGetResponse,
  TransactionParams,
} from "./clientTransactionApi";

export const getCurrentUser = async (): Promise<User> => {
  const coockieStore = await cookies();
  const { data } = await nextServer.get<User>("/users/current", {
    headers: {
      Cookie: coockieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  const coockieStore = await cookies();
  const { data } = await nextServer.get<SessionResponse>("/auth/session", {
    headers: {
      Cookie: coockieStore.toString(),
    },
  });
  return data.success;
};

export const getTransaction = async (
  params: TransactionParams,
): Promise<TransactionGetResponse[]> => {
  const coockieStore = await cookies();
  const { data } = await nextServer.get<TransactionGetResponse[]>(
    `/transactions/${params.type}`,
    {
      params: {
        date: params?.date,
        search: params?.search,
      },
      headers: {
        Cookie: coockieStore.toString(),
      },
    },
  );
  return data;
};

export const getCategoriesStats = async (): Promise<CategoryStats[]> => {
  const coockieStore = await cookies();
  const { data } = await nextServer.get<CategoryStats[]>(
    "/stats/categories/current-month",
    {
      headers: {
        Cookie: coockieStore.toString(),
      },
    },
  );
  return data;
};
