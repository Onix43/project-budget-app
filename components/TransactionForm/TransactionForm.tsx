"use client";

import { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { NumericFormat } from "react-number-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CategoriesModal from "../CategoriesModal/CategoriesModal";
import "react-datepicker/dist/react-datepicker.css";
import css from "./TransactionForm.module.css";
import Modal from "../Modal/Modal";
import {
  createTransaction,
  updateTransaction,
  type TransactionGetResponse,
} from "@/lib/api/clientTransactionApi";
import type { CategoryType } from "@/types/category";

type Category = {
  id: string;
  name: string;
};

type TransactionType = "expense" | "income";

type TransactionFormProps = {
  mode?: "create" | "edit";
  initialType?: TransactionType;
  transaction?: TransactionGetResponse;
  onClose?: () => void;
};

type CategoriesByType = {
  expense: Category[];
  income: Category[];
};

type FormValues = {
  transactionType: TransactionType;
  date: Date;
  time: string;
  category: string;
  sum: string;
  comment: string;
};

const getCurrentTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const toCategoryType = (t: TransactionType): CategoryType =>
  t === "income" ? "incomes" : "expenses";

const fromCategoryType = (t: CategoryType): TransactionType =>
  t === "incomes" ? "income" : "expense";

const validationSchema = Yup.object({
  transactionType: Yup.string()
    .oneOf(["expense", "income"])
    .required("Choose transaction type"),
  date: Yup.date().required("Date is required"),
  time: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Enter time as HH:mm:ss")
    .required("Time is required"),
  category: Yup.string().trim().required("Category is required"),
  sum: Yup.number()
    .typeError("Enter a valid sum")
    .positive("Sum must be greater than 0")
    .required("Sum is required"),
  comment: Yup.string().max(100, "Max 100 characters"),
});

export default function TransactionForm({
  mode = "create",
  initialType = "expense",
  transaction,
  onClose,
}: TransactionFormProps) {
  const queryClient = useQueryClient();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categoriesByType, setCategoriesByType] = useState<CategoriesByType>({
    expense: [
      { id: "1", name: "Food" },
      { id: "2", name: "Transport" },
    ],
    income: [
      { id: "3", name: "Salary" },
      { id: "4", name: "Freelance" },
    ],
  });

  const isEdit = mode === "edit" && !!transaction;

  const initialValues = useMemo<FormValues>(() => {
    if (isEdit && transaction) {
      return {
        transactionType: fromCategoryType(transaction.type),
        date: new Date(transaction.date),
        time: transaction.time,
        category: transaction.category.categoryName,
        sum: String(transaction.sum),
        comment: transaction.comment ?? "",
      };
    }
    return {
      transactionType: initialType,
      date: new Date(),
      time: getCurrentTime(),
      category: "",
      sum: "",
      comment: "",
    };
  }, [isEdit, transaction, initialType]);

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.type],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.originalType ?? variables.type],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.type],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      onClose?.();
    },
  });

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    const type = toCategoryType(values.transactionType);
    const payload = {
      type,
      date: values.date.toISOString().split("T")[0],
      time: values.time,
      category: values.category,
      sum: Number(values.sum),
      comment: values.comment.trim(),
    };

    try {
      if (isEdit && transaction) {
        await updateMutation.mutateAsync({
          ...payload,
          _id: transaction._id,
          originalType: transaction.type,
        });
      } else {
        await createMutation.mutateAsync(payload);
        actions.resetForm({
          values: {
            transactionType: values.transactionType,
            date: new Date(),
            time: getCurrentTime(),
            category: "",
            sum: "",
            comment: "",
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => {
        const currentCategories = categoriesByType[values.transactionType];

        return (
          <>
            <Form className={css.form}>
              <div className={css.radioGroup}>
                <label className={css.radioLabel}>
                  <Field
                    type="radio"
                    name="transactionType"
                    value="expense"
                    checked={values.transactionType === "expense"}
                    onChange={() => {
                      setFieldValue("transactionType", "expense");
                      setFieldValue("category", "");
                    }}
                  />
                  <span>Expense</span>
                </label>

                <label className={css.radioLabel}>
                  <Field
                    type="radio"
                    name="transactionType"
                    value="income"
                    checked={values.transactionType === "income"}
                    onChange={() => {
                      setFieldValue("transactionType", "income");
                      setFieldValue("category", "");
                    }}
                  />
                  <span>Income</span>
                </label>
              </div>

              <ErrorMessage
                name="transactionType"
                component="p"
                className={css.error}
              />

              <div className={css.row}>
                <div className={css.fieldGroup}>
                  <label className={css.label}>Date</label>

                  <DatePicker
                    selected={values.date}
                    onChange={(date: Date | null) =>
                      setFieldValue("date", date ?? new Date())
                    }
                    dateFormat="dd.MM.yyyy"
                    className={css.input}
                    calendarClassName={css.calendar}
                    popperClassName={css.popper}
                    showPopperArrow={false}
                  />

                  <ErrorMessage
                    name="date"
                    component="p"
                    className={css.error}
                  />
                </div>

                <div className={css.fieldGroup}>
                  <label className={css.label} htmlFor="time">
                    Time
                  </label>

                  <Field
                    className={css.input}
                    id="time"
                    name="time"
                    type="time"
                    step="1"
                  />

                  <ErrorMessage
                    name="time"
                    component="p"
                    className={css.error}
                  />
                </div>
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label}>Category</label>

                <button
                  type="button"
                  className={css.categoryButton}
                  onClick={() => setIsCategoriesOpen(true)}
                >
                  {values.category || "Different"}
                </button>

                <ErrorMessage
                  name="category"
                  component="p"
                  className={css.error}
                />
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label} htmlFor="sum">
                  Sum
                </label>

                <div className={css.sumWrapper}>
                  <NumericFormat
                    id="sum"
                    name="sum"
                    className={css.input}
                    placeholder="Enter the sum"
                    value={values.sum}
                    thousandSeparator=" "
                    decimalSeparator="."
                    decimalScale={2}
                    allowNegative={false}
                    fixedDecimalScale={false}
                    onValueChange={(value) => {
                      setFieldValue("sum", value.value);
                    }}
                  />

                  <span className={css.currency}>UAH</span>
                </div>

                <ErrorMessage name="sum" component="p" className={css.error} />
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label} htmlFor="comment">
                  Comment
                </label>

                <Field
                  as="textarea"
                  className={css.textarea}
                  id="comment"
                  name="comment"
                  placeholder="Enter the text"
                />

                <ErrorMessage
                  name="comment"
                  component="p"
                  className={css.error}
                />
              </div>

              <button
                className={css.submitButton}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEdit
                    ? "Saving..."
                    : "Sending..."
                  : isEdit
                    ? "Save"
                    : "Add"}
              </button>
            </Form>

            {isCategoriesOpen && (
              <Modal onClose={() => setIsCategoriesOpen(false)}>
                <CategoriesModal
                  transactionType={values.transactionType}
                  onSelectCategory={(category) => {
                    setFieldValue("category", category);
                    setIsCategoriesOpen(false);
                  }}
                  categories={currentCategories}
                  setCategories={(updater) =>
                    setCategoriesByType((prev) => ({
                      ...prev,
                      [values.transactionType]:
                        typeof updater === "function"
                          ? updater(prev[values.transactionType])
                          : updater,
                    }))
                  }
                />
              </Modal>
            )}
          </>
        );
      }}
    </Formik>
  );
}
