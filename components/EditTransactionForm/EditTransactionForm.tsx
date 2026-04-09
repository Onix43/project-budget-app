"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@/lib/api/clientTransactionApi";
import type { TransactionGetResponse } from "@/lib/api/clientTransactionApi";
import { useUserStore } from "@/lib/store/useUserStore";
import type { CategoryType } from "@/types/category";
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import CustomTimePicker from "@/components/CustomTimePicker/CustomTimePicker";
import CategoriesModal from "@/components/CategoriesModal/CategoriesModal";
import Modal from "@/components/Modal/Modal";
import css from "./EditTransactionForm.module.css";
import FullPageLoader from "../FullPageLoader/FullPageLoader";

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

export default function EditTransactionForm({
  transaction,
  onClose,
}: TransactionFormProps) {
  const queryClient = useQueryClient();
  const currency = useUserStore(
    (state) => state.user?.currency?.toUpperCase() ?? "UAH",
  );
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string>(
    transaction.category.categoryName,
  );

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
      queryClient.invalidateQueries({ queryKey: ["categoriesStats"] });
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
      {({ values, setFieldValue, isSubmitting }) => {
        return (
          <>
            {isSubmitting && <FullPageLoader />}
            <Form className={css.form}>
              <div className={css.row}>
                <div className={css.field}>
                  <label className={css.label}>Date</label>
                  <CustomDatePicker
                    selected={values.date ? new Date(values.date) : new Date()}
                    onChange={(date: Date | null) => {
                      if (!date) return;
                      const formattedDate = date.toISOString().split("T")[0];
                      setFieldValue("date", formattedDate);
                    }}
                  />
                  <ErrorMessage
                    component="span"
                    name="date"
                    className={css.error}
                  />
                </div>
                <div className={css.field}>
                  <label className={css.label}>Time</label>
                  <CustomTimePicker
                    value={values.time}
                    onChange={(time) => setFieldValue("time", time)}
                    selectedDate={
                      values.date ? new Date(values.date) : new Date()
                    }
                  />
                  <ErrorMessage
                    component="span"
                    name="time"
                    className={css.error}
                  />
                </div>
              </div>

              <div className={css.field}>
                <label className={css.label}>Category</label>
                <button
                  type="button"
                  className={css.categoryButton}
                  onClick={() => setIsCategoriesOpen(true)}
                >
                  {categoryName || "Different"}
                </button>
                <ErrorMessage
                  component="span"
                  name="category"
                  className={css.error}
                />
              </div>

              <div className={css.field}>
                <label className={css.label}>Sum</label>
                <div className={css.sumWrapper}>
                  <Field
                    className={css.input}
                    type="number"
                    name="sum"
                    min="0"
                    step="0.01"
                  />
                  <span className={css.currency}>{currency}</span>
                </div>
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

              <button
                type="submit"
                className={css.submitBtn}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </button>
            </Form>

            {isCategoriesOpen && (
              <Modal onClose={() => setIsCategoriesOpen(false)}>
                <CategoriesModal
                  transactionType={values.type}
                  onSelectCategory={(id, name) => {
                    setFieldValue("category", id);
                    setCategoryName(name);
                    setIsCategoriesOpen(false);
                  }}
                />
              </Modal>
            )}
          </>
        );
      }}
    </Formik>
  );
}
