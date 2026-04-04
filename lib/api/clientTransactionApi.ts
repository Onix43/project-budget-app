import { Transaction, type TransactionWithId } from "@/types/transaction";
import { nextServer } from "./api";
import { CategoryType } from "@/types/category";
import { UpdateCategoryData } from "./clientCategoryApi";

interface TransactionCreateResponse {
  transaction: TransactionWithId;
  total: number;
}

interface TransactionParams {
  type: CategoryType;
  date?: string;
  search?: string;
}

interface TransactionGetResponse {
  _id: string;
  type: CategoryType;
  date: string;
  time: string;
  category: UpdateCategoryData;
  sum: number;
  comment?: string;
}

type TransactionResponseWithoutIdAndType = Omit<
  TransactionGetResponse,
  "_id" | "type"
>;

interface TransactionUpdateResponse {
  transaction: TransactionResponseWithoutIdAndType;
  total: number;
}

interface TransactionDeleteResponse {
  total: number;
}

export const createTransaction = async (
  newTransaction: Transaction,
): Promise<TransactionCreateResponse> => {
  const { data } = await nextServer.post<TransactionCreateResponse>(
    "/transactions",
    newTransaction,
  );
  return data;
};

export const getTransaction = async (
  params: TransactionParams,
): Promise<TransactionGetResponse[]> => {
  const { data } = await nextServer.get<TransactionGetResponse[]>(
    `/transactions`,
    {
      params,
    },
  );
  return data;
};

export const updateTransaction = async (
  transactionData: TransactionWithId,
): Promise<TransactionUpdateResponse> => {
  const { _id, type, ...updateData } = transactionData;
  const { data } = await nextServer.patch<TransactionUpdateResponse>(
    `/transactions/${type}/${_id}`,
    updateData,
  );

  return data;
};

export const deleteTransaction = async (
  id: string,
): Promise<TransactionDeleteResponse> => {
  const { data } = await nextServer.delete<TransactionDeleteResponse>(
    `/transactions/${id}`,
  );
  return data;
};
