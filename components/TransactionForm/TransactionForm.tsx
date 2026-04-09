"use client";

import { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { NumericFormat } from "react-number-format";
import CategoriesModal from "../CategoriesModal/CategoriesModal";
import "react-datepicker/dist/react-datepicker.css";
import "izitoast/dist/css/iziToast.min.css";
import css from "./TransactionForm.module.css";
import Modal from "../Modal/Modal";
import { createTransaction } from "@/lib/api/clientTransactionApi";
import { CategoryType } from "@/types/category";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import Button from "../Button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";
import CustomTimePicker from "../CustomTimePicker/CustomTimePicker";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import FullPageLoader from "../FullPageLoader/FullPageLoader";

type TransactionFormProps = {
  initialType?: CategoryType;
};

type FormValues = {
  type: CategoryType;
  date: string;
  time: string;
  category: string;
  sum: string;
  comment: string;
};

const getCurrentTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const validationSchema = Yup.object({
  type: Yup.string()
    .oneOf(["expenses", "incomes"])
    .required("Choose transaction type"),
  date: Yup.string()
    .matches(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      "Date must be in format YYYY-MM-DD",
    )
    .required("Date is required"),
  time: Yup.string()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter time as HH:mm")
    .required("Time is required"),
  category: Yup.string().trim().required("Category is required"),
  sum: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Enter a valid sum")
    .positive("Sum must be greater than 0")
    .required("Sum is required"),
  comment: Yup.string()
    .min(3, "Min 3 characters")
    .max(100, "Max 100 characters"),
});

export default function TransactionForm({
  initialType = "expenses",
}: TransactionFormProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [submitingId, setSubmitingId] = useState<string>("");

  const queryClient = useQueryClient();

  const router = useRouter();

  const { user } = useUserStore();

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const { mutateAsync } = useMutation({
    mutationFn: (payload: Transaction) => createTransaction(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoriesStats"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
  const initialValues = useMemo<FormValues>(
    () => ({
      type: initialType,
      date: getCurrentDate(),
      time: getCurrentTime(),
      category: "",
      sum: "",
      comment: "",
    }),
    [initialType],
  );

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    const payload: Transaction = {
      type: values.type,
      date: values.date,
      time: values.time,
      category: submitingId,
      sum: Number(values.sum),
      comment: values.comment.trim(),
    };
    try {
      const iziToast = (await import("izitoast")).default;

      if (payload.comment?.length === 0) {
        const { comment, ...rest } = payload;
        await mutateAsync(rest);
        actions.resetForm();
        iziToast.success({
          message: "Transaction added!",
          position: "topCenter",
          timeout: 3000,
          displayMode: 2,
        });
        return;
      }

      await mutateAsync(payload);
      actions.resetForm();
      iziToast.success({
        message: "Transaction added!",
        position: "topCenter",
        timeout: 3000,
        displayMode: 2,
      });
    } catch {
      const iziToast = (await import("izitoast")).default;

      iziToast.error({
        title: "Error",
        message: "Something went wrong when sending your transaction",
        position: "topCenter",
        timeout: 3000,
        displayMode: 2,
      });
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting, touched, errors }) => {
        const getFieldClass = (
          fieldName: string,
          baseClass: string = css.input,
        ) => {
          return `${baseClass} ${touched[fieldName as keyof FormValues] && errors[fieldName as keyof FormValues] ? css.inputError : ""}`;
        };

        return (
          <>
            {isSubmitting && <FullPageLoader />}
            <Form className={css.form}>
              <div className={css.radioGroup}>
                <label className={css.radioLabel}>
                  <Field
                    type="radio"
                    name="transactionType"
                    value="expenses"
                    checked={values.type === "expenses"}
                    onChange={() => {
                      setFieldValue("transactionType", "expenses");
                      setFieldValue("category", "");
                      router.push("/transactions/expenses");
                    }}
                  />
                  <span>Expense</span>
                </label>

                <label className={css.radioLabel}>
                  <Field
                    type="radio"
                    name="transactionType"
                    value="incomes"
                    checked={values.type === "incomes"}
                    onChange={() => {
                      setFieldValue("transactionType", "incomes");
                      setFieldValue("category", "");
                      router.push("/transactions/incomes");
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

                  <CustomDatePicker
                    selected={values.date ? new Date(values.date) : new Date()}
                    onChange={(date: Date | null) => {
                      if (date) {
                        const formattedDate = date.toISOString().split("T")[0];
                        console.log(formattedDate);
                        setFieldValue("date", formattedDate);
                      }
                    }}
                    isPostForm={true}
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

                  <CustomTimePicker
                    value={values.time}
                    onChange={(time) => setFieldValue("time", time)}
                    selectedDate={
                      values.date ? new Date(values.date) : new Date()
                    }
                    isMainForm={true}
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
                  className={getFieldClass("category", css.categoryButton)}
                  style={{
                    color: values.category
                      ? "white"
                      : "rgba(255, 255, 255, 0.4)",
                  }}
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
                    className={getFieldClass("sum")}
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

                  <span className={css.currency}>
                    {user?.currency.toUpperCase()}
                  </span>
                </div>

                <ErrorMessage name="sum" component="p" className={css.error} />
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label} htmlFor="comment">
                  Comment
                </label>

                <Field
                  as="textarea"
                  className={getFieldClass("comment", css.textarea)}
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

              <Button
                color="green"
                text={isSubmitting ? "Sending..." : "Add"}
                disabled={isSubmitting}
                type="submit"
                className={css.submitButtonForm}
              ></Button>
            </Form>

            {isCategoriesOpen && (
              <Modal
                onClose={() => setIsCategoriesOpen(false)}
                customClass={"category-modal"}
              >
                <CategoriesModal
                  transactionType={values.type}
                  currentCategoryName={values.category}
                  onSelectCategory={(category, name) => {
                    setFieldValue("category", name);
                    setSubmitingId(category);
                    setIsCategoriesOpen(false);
                  }}
                  onResetCategory={() => {
                    setFieldValue("category", "");
                    setSubmitingId("");
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
