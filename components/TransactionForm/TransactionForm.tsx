"use client";

import { useMemo, useState } from "react";
import CategoriesModal from "../CategoriesModal/CategoriesModal";
import css from "./TransactionForm.module.css";

type Category = {
  id: string;
  name: string;
};

export default function TransactionForm() {
  const [transactionType, setTransactionType] = useState<"expense" | "income">(
    "expense"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sum, setSum] = useState("");
  const [time, setTime] = useState("00:00:00");

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const handleOpenCategories = () => {
    setIsCategoriesOpen(true);
  };

  const handleCloseCategories = () => {
    setIsCategoriesOpen(false);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsCategoriesOpen(false);
  };

  const handleSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setSum("");
      return;
    }

    if (Number(value) > 0) {
      setSum(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sum || Number(sum) <= 0) {
      alert("Sum must be greater than 0");
      return;
    }

    console.log("submit");
  };

  return (
    <>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.radioGroup}>
          <label className={css.radioLabel}>
            <input
              type="radio"
              name="transactionType"
              value="expense"
              checked={transactionType === "expense"}
              onChange={() => setTransactionType("expense")}
            />
            <span>Expense</span>
          </label>

          <label className={css.radioLabel}>
            <input
              type="radio"
              name="transactionType"
              value="income"
              checked={transactionType === "income"}
              onChange={() => setTransactionType("income")}
            />
            <span>Income</span>
          </label>
        </div>

        <div className={css.row}>
          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="date">
              Date
            </label>
            <input
              className={css.input}
              id="date"
              name="date"
              type="date"
              max={today}
              defaultValue={today}
            />
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="time">
              Time
            </label>
            <input
              className={css.input}
              id="time"
              name="time"
              type="time"
              value={time}
              step="1"
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="category">
            Category
          </label>
          <button
            type="button"
            className={css.categoryButton}
            onClick={handleOpenCategories}
          >
            {selectedCategory || "Different"}
          </button>
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="sum">
            Sum
          </label>

          <div className={css.sumWrapper}>
            <input
              className={css.input}
              id="sum"
              name="sum"
              type="number"
              placeholder="Enter the sum"
              min="0.01"
              step="0.01"
              value={sum}
              onChange={handleSumChange}
            />
            <span className={css.currency}>UAH</span>
          </div>
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="comment">
            Comment
          </label>
          <textarea
            className={css.textarea}
            id="comment"
            name="comment"
            placeholder="Enter the text"
          />
        </div>

        <button className={css.submitButton} type="submit">
          Add
        </button>
      </form>

      {isCategoriesOpen && (
        <CategoriesModal
          onClose={handleCloseCategories}
          onSelectCategory={handleSelectCategory}
          categories={categories}
          setCategories={setCategories}
        />
      )}
    </>
  );
}