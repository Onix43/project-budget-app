"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@/lib/api/clientTransactionApi";
import type { TransactionGetResponse } from "@/lib/api/clientTransactionApi";
import { getCategories } from "@/lib/api/clientCategoryApi";
import type { CategoryType } from "@/types/category";
import css from "./TransactionForm.module.css";

let iziToastCssLoaded = false;
const showToast = (
  type: "success" | "error",
  title: string,
  message: string,
) => {
  if (!iziToastCssLoaded) {
    import("izitoast/dist/css/iziToast.min.css");
    iziToastCssLoaded = true;
  }
  import("izitoast").then((mod) => {
    mod.default[type]({ title, message, position: "topRight" });
  });
};

interface TransactionFormProps {
  transaction: TransactionGetResponse;
  onClose: () => void;
}

interface FormValues {
  type: CategoryType;
  date: string;
  time: string;
  category: string;
  sum: number;
  comment: string;
}

const validationSchema = Yup.object({
  type: Yup.string().oneOf(["expenses", "incomes"]).required("Required"),
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
  category: Yup.string().required("Category is required"),
  sum: Yup.number().min(0.01, "Min 0.01").required("Sum is required"),
  comment: Yup.string().max(300, "Max 300 characters"),
});

function TypeWatcher({ type, setFieldValue }: { type: CategoryType; setFieldValue: (field: string, value: string) => void }) {
  const prevType = useRef(type);
  useEffect(() => {
    if (prevType.current !== type) {
      prevType.current = type;
      setFieldValue("category", "");
    }
  }, [type, setFieldValue]);
  return null;
}

export default function TransactionForm({
  transaction,
  onClose,
}: TransactionFormProps) {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateTransaction({
        _id: transaction._id,
        originalType: transaction.type,
        type: values.type,
        date: values.date,
        time: values.time,
        category: values.category,
        sum: values.sum,
        comment: values.comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "expenses"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", "incomes"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      showToast("success", "Updated", "Transaction updated successfully");
      onClose();
    },
    onError: () => {
      showToast("error", "Error", "Failed to update transaction");
    },
  });

  const initialValues: FormValues = {
    type: transaction.type,
    date: transaction.date,
    time: transaction.time,
    category: transaction.category._id,
    sum: transaction.sum,
    comment: transaction.comment ?? "",
  };

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        const categoryOptions =
          values.type === "incomes"
            ? categories?.incomes ?? []
            : categories?.expenses ?? [];

        return (
          <Form className={css.form}>
            <TypeWatcher type={values.type} setFieldValue={setFieldValue} />
            <div className={css.radioGroup}>
              <label className={css.radioLabel}>
                <Field type="radio" name="type" value="expenses" />
                Expense
              </label>
              <label className={css.radioLabel}>
                <Field type="radio" name="type" value="incomes" />
                Income
              </label>
            </div>

            <div className={css.row}>
              <div className={css.field}>
                <label className={css.label}>Date</label>
                <Field className={css.input} type="date" name="date" />
                <ErrorMessage
                  component="span"
                  name="date"
                  className={css.error}
                />
              </div>
              <div className={css.field}>
                <label className={css.label}>Time</label>
                <Field className={css.input} type="time" name="time" />
                <ErrorMessage
                  component="span"
                  name="time"
                  className={css.error}
                />
              </div>
            </div>

            <div className={css.field}>
              <label className={css.label}>Category</label>
              <Field as="select" className={css.select} name="category">
                <option value="">Select category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                component="span"
                name="category"
                className={css.error}
              />
            </div>

            <div className={css.field}>
              <label className={css.label}>Sum</label>
              <Field
                className={css.input}
                type="number"
                name="sum"
                min="0"
                step="0.01"
              />
              <ErrorMessage
                component="span"
                name="sum"
                className={css.error}
              />
            </div>

            <div className={css.field}>
              <label className={css.label}>Comment</label>
              <Field
                className={css.input}
                type="text"
                name="comment"
                placeholder="Add a comment..."
              />
              <ErrorMessage
                component="span"
                name="comment"
                className={css.error}
              />
            </div>

            <button type="submit" className={css.submitBtn} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
