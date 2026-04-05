"use client";

import { useEffect, useState } from "react";
import css from "./CategoriesModal.module.css";

type Category = {
  id: string;
  name: string;
};

type CategoriesModalProps = {
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export default function CategoriesModal({
  onClose,
  onSelectCategory,
  categories,
  setCategories,
}: CategoriesModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // закрытие по ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // закрытие по клику вне
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // добавление / редактирование
  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    const isDuplicate = categories.some(
      (c) =>
        c.name.toLowerCase() === trimmedValue.toLowerCase() &&
        c.id !== editingCategoryId
    );

    if (isDuplicate) return;

    if (editingCategoryId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategoryId ? { ...c, name: trimmedValue } : c
        )
      );
      setEditingCategoryId(null);
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: trimmedValue,
        },
      ]);
    }

    setInputValue("");
  };

  // редактировать
  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    setInputValue(category.name);
    setEditingCategoryId(id);
  };

  // удалить
  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    if (editingCategoryId === id) {
      setEditingCategoryId(null);
      setInputValue("");
    }
  };

  // выбрать категорию
  const handleSelect = (name: string) => {
    onSelectCategory(name);
    onClose();
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button className={css.closeButton} type="button" onClick={onClose}>
          ×
        </button>

        <h2 className={css.title}>Expenses</h2>
        <p className={css.subtitle}>All Category</p>

        <ul className={css.list}>
          {categories.map((category) => (
            <li key={category.id} className={css.item}>
              <button
                type="button"
                className={css.categoryButton}
                onClick={() => handleSelect(category.name)}
              >
                {category.name}
              </button>

              <div className={css.actions}>
                <button
  type="button"
  className={css.iconButton}
  onClick={() => handleSelect(category.name)}
>
  <svg width="16" height="16" viewBox="0 0 32 32">
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

<button
  type="button"
  className={css.iconButton}
  onClick={() => handleEdit(category.id)}
>
  <svg width="16" height="16" viewBox="0 0 32 32">
    <path
      d="M22.933 2.778c0.374-0.374 0.817-0.67 1.305-0.872s1.011-0.306 1.539-0.306c0.528 0 1.052 0.104 1.539 0.306s0.932 0.498 1.305 0.872s0.67 0.817 0.872 1.305c0.202 0.488 0.306 1.011 0.306 1.539s-0.104 1.051-0.306 1.539c-0.202 0.488-0.498 0.931-0.872 1.305l-19.2 19.2-7.822 2.133 2.133-7.822 19.2-19.2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
</button>

<button
  type="button"
  className={css.iconButton}
  onClick={() => handleDelete(category.id)}
>
  <svg width="16" height="16" viewBox="0 0 32 32">
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
              {editingCategoryId ? "Edit" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}