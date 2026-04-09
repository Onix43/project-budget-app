"use client";

import { useState } from "react";
import css from "./CategoriesModal.module.css";
import { CategoryType } from "@/types/category";
import {
  createCategory,
  CreateCategotyData,
  deleteByCategoryId,
  getCategories,
  updateByCategoryId,
  UpdateCategoryData,
} from "@/lib/api/clientCategoryApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CategoriesModalProps {
  transactionType: CategoryType;
  onSelectCategory: (category: string, name: string) => void;
}

export default function CategoriesModal({
  transactionType,
  onSelectCategory,
}: CategoriesModalProps) {
  const title = transactionType === "expenses" ? "Expenses" : "Incomes";
  const [inputValue, setInputValue] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: string) => deleteByCategoryId(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: async () => {
      const iziToast = (await import("izitoast")).default;

      iziToast.error({
        title: "Error",
        message: "Something went wrong when deleting category",
        position: "bottomRight",
        timeout: 3000,
        displayMode: 2,
      });
    },
  });
  const handleDelete = async (id: string) => {
    deleteMutation(id);
  };

  const { mutate: editMutation, isPending } = useMutation({
    mutationFn: ({ _id, categoryName }: UpdateCategoryData) =>
      updateByCategoryId({ _id, categoryName }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategoryId(null);
      setInputValue("");
    },
    onError: async () => {
      const iziToast = (await import("izitoast")).default;

      iziToast.error({
        title: "Error",
        message: "Something went wrong when editing category",
        position: "bottomRight",
        timeout: 3000,
        displayMode: 2,
      });
    },
  });

  const { mutate: postMutation } = useMutation({
    mutationFn: ({ type, categoryName }: CreateCategotyData) =>
      createCategory({ type, categoryName }),

    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setInputValue("");
      if (created?._id) {
        onSelectCategory(created._id, created.categoryName);
      }
    },
    onError: async () => {
      const iziToast = (await import("izitoast")).default;

      iziToast.error({
        title: "Error",
        message: "Something went wrong when adding category",
        position: "bottomRight",
        timeout: 3000,
        displayMode: 2,
      });
    },
  });

  const handleEdit = async (id: string, categoryName: string) => {
    setInputValue(categoryName);
    setEditingCategoryId(id);
  };

  const handleSubmit = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    if (!categories) return;

    const isDuplicate = categories?.[transactionType]?.some(
      (category) =>
        category.categoryName.toLowerCase() === trimmedValue.toLowerCase() &&
        category._id !== editingCategoryId,
    );

    if (isDuplicate) return;

    if (editingCategoryId) {
      editMutation({ _id: editingCategoryId, categoryName: inputValue });
    } else {
      postMutation({ type: transactionType, categoryName: inputValue });
    }
  };
  return (
    <div>
      <h2 className={css.title}>{title}</h2>
      <p className={css.subtitle}>All Category</p>

      <ul className={css.list}>
        {categories &&
          categories?.[transactionType]?.length > 0 &&
          categories[transactionType].map((category) => (
            <li key={category._id} className={css.item}>
              <button
                type="button"
                className={css.categoryButton}
                onClick={() =>
                  onSelectCategory(category._id, category.categoryName)
                }
              >
                {category.categoryName}
              </button>

              <div className={css.actions}>
                {/* CHECK */}
                <button
                  type="button"
                  className={css.iconButton}
                  onClick={() =>
                    onSelectCategory(category._id, category.categoryName)
                  }
                >
                  <svg width="18" height="18" viewBox="0 0 32 32">
                    <path
                      d="M27.333 8l-14.667 14.667-6.667-6.667"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* EDIT */}
                <button
                  type="button"
                  className={css.iconButton}
                  onClick={() =>
                    handleEdit(category._id, category.categoryName)
                  }
                >
                  <svg width="18" height="18" viewBox="0 0 32 32">
                    <path
                      d="M22.933 2.778c0.374-0.374 0.817-0.67 1.305-0.872s1.011-0.306 1.539-0.306c0.528 0 1.052 0.104 1.539 0.306s0.932 0.498 1.305 0.872s0.67 0.817 0.872 1.305c0.202 0.488 0.306 1.011 0.306 1.539s-0.104 1.051-0.306 1.539c-0.202 0.488-0.498 0.931-0.872 1.305l-19.2 19.2-7.822 2.133 2.133-7.822 19.2-19.2z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>

                {/* DELETE */}
                <button
                  type="button"
                  className={css.iconButton}
                  onClick={() => handleDelete(category._id)}
                >
                  <svg width="18" height="18" viewBox="0 0 32 32">
                    <path
                      d="M4 8h24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M25.333 8v18.667c0 0.707-0.281 1.385-0.781 1.886s-1.178 0.781-1.886 0.781h-13.333c-0.707 0-1.386-0.281-1.886-0.781s-0.781-1.178-0.781-1.886v-18.667"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      d="M13.334 14.667v8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      d="M18.666 14.667v8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
      </ul>
      <div className={css.addBlock}>
        <label className={css.newCategoryLabel} htmlFor="newCategory">
          New Category
        </label>

        <div className={css.inputRow}>
          <input
            className={css.input}
            id="newCategory"
            type="text"
            placeholder="Enter the text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button
            className={css.addButton}
            type="button"
            onClick={handleSubmit}
          >
            {isPending ? "Editing..." : editingCategoryId ? "Edit" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
