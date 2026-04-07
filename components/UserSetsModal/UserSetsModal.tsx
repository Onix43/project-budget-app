"use client";
import css from "./UserSetsModal.module.css";

import { useState, useRef } from "react";
import { AxiosError } from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import * as Yup from "yup";

import { useUserStore } from "@/lib/store/useUserStore";
import {
  updateUserProfile,
  updateUserAvatar,
  deleteUserAvatar,
} from "@/lib/api/clientUserApi";
import Button from "@/components/Button/Button";

const UserSetsSchema = Yup.object().shape({
  name: Yup.string().min(2, "Your name is too short").required("Required"),
  currency: Yup.string().required("Required"),
});

export default function Page() {
  const { user, setUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currencies = [
    { code: "UAH", symbol: "₴" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
  ];

  const notify = async (type: "success" | "error", message: string) => {
    if (typeof window !== "undefined") {
      const iziToast = (await import("izitoast")).default;
      iziToast[type]({ message, position: "topRight" });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await updateUserAvatar(file);
      if (user) setUser({ ...user, avatarUrl: res.avatarUrl });
      await notify("success", "Avatar updated!");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      await notify("error", error.response?.data?.message || "Upload error");
    }
  };

  const handleRemove = async () => {
    try {
      await deleteUserAvatar();
      if (user)
        setUser({ ...user, avatarUrl: null });
      await notify("success", "Avatar removed");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      await notify("error", error.response?.data?.message || "Remove error");
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.profileTitle}>Profile settings</h2>

      {/* Блок Аватара */}
      <div className={css.profileAvatare}>
        <Image
          className={css.profileAvatareImg}
          src={user?.avatarUrl || "/default-user-avatar.png"}
          alt="Avatar"
          width={100}
          height={100}
        />
        <div className={css.AvatareBtnWraper}>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleAvatarChange}
            accept="image/*"
          />
          <Button
            className={css.AvatareBtn}
            color="gray"
            text="Upload new photo"
            onClick={() => fileInputRef.current?.click()}
          />
          <Button
            className={css.AvatareBtn}
            color="gray"
            text="Remove"
            onClick={handleRemove}
          />
        </div>
      </div>

      <Formik
        initialValues={{
          name: user?.name || "",
          currency: user?.currency || "UAH",
        }}
        validationSchema={UserSetsSchema}
        enableReinitialize={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const updated = await updateUserProfile(values);
            if (user) setUser({ ...user, ...updated });
            await notify("success", "Profile saved successfully!");
          } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMessage =
              error.response?.data?.message || "Something went wrong";

            await notify("error", errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            {/* Блок Валюти */}
            <div className={css.profileSettings}>
              <div className={css.profileCurrency}>
                <div
                  className={css.selectWrapper}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={css.selectedValue}>
                    <span className={css.symbol}>
                      {
                        currencies.find((c) => c.code === values.currency.toUpperCase())?.symbol
                      }
                    </span>{" "}
                    {values.currency.toUpperCase()}
                  </span>
                  <Image
                    src="/arrow-down.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className={`${css.arrowIcon} ${isOpen ? css.rotated : ""}`}
                  />
                </div>

                {isOpen && (
                  <ul className={css.customOptionsList}>
                    {currencies.map((curr) => (
                      <li
                        key={curr.code}
                        className={`${css.optionItem} ${values.currency === curr.code ? css.activeOption : ""}`}
                        onClick={() => {
                          setFieldValue("currency", curr.code);
                          setIsOpen(false);
                        }}
                      >
                        <span className={css.optionSymbol}>{curr.symbol}</span>{" "}
                        {curr.code}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Блок смены имени */}
              <div className={css.profileNameWrapper}>
                <div
                  className={`${css.profileName} ${errors.name && touched.name ? css.errorBorder : ""}`}
                >
                  <Field
                    name="name"
                    type="text"
                    className={css.nameInput}
                    placeholder="Enter your name"
                  />
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.errorText}
                />
              </div>
            </div>

            <Button
              type="submit"
              className={css.btnSave}
              color="green"
              text={isSubmitting ? "Saving..." : "Save"}
              onClick={() => console.log("Save settings")}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
