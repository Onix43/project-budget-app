import { Category, CategoryStats, CategoryType } from "@/types/category";
import { nextServer } from "./api";

export interface CreateCategotyData {
  type: CategoryType;
  categoryName: string;
}

export interface ResponseCategory {
  incomes: Category[];
  expenses: Category[];
}

export interface UpdateCategoryData {
  _id: string;
  categoryName: string;
}

export const createCategory = async (
  categoryData: CreateCategotyData,
): Promise<Category> => {
  const { data } = await nextServer.post<Category>("/categories", categoryData);
  return data;
};

export const getCategories = async (): Promise<ResponseCategory> => {
  const { data } = await nextServer.get<ResponseCategory>("/categories");
  return data;
};

export const updateByCategoryId = async ({
  _id,
  categoryName,
}: UpdateCategoryData): Promise<UpdateCategoryData> => {
  const { data } = await nextServer.patch<UpdateCategoryData>(
    `/categories/${_id}`,
    { categoryName },
  );
  return data;
};

export const deleteByCategoryId = async (categoryId: string): Promise<void> => {
  await nextServer.delete(`/categories/${categoryId}`);
};

export const getCategoriesStats = async (): Promise<CategoryStats[]> => {
  const { data } = await nextServer.get<CategoryStats[]>(
    "/stats/categories/current-month",
  );
  return data;
};
