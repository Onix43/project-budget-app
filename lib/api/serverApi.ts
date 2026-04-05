import { cookies } from "next/headers";
import { nextServer } from "./api";

import { User } from "@/types/user";
import { CategoryStats } from "@/types/category";
import {
  TransactionGetResponse,
  TransactionParams,
} from "./clientTransactionApi";

interface SessionResponse {
  headers: {
    "set-cookie"?: string[];
  };
  status: number;
}

export const getCurrentUser = async (): Promise<User> => {
  const coockieStore = await cookies();
  const { data } = await nextServer.get<User>("/users/current", {
    headers: {
      Cookie: coockieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async (): Promise<SessionResponse> => {
  const coockieStore = await cookies();
  const res = await nextServer.get<SessionResponse>("/auth/session", {
    headers: {
      Cookie: coockieStore.toString(),
    },
  });
  return res;
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
