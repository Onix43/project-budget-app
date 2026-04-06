"use client";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { login, LoginData } from "@/lib/api/clientAuthApi";
import css from "./SignIn.module.css";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import EyeOpen from "@/components/EyeOpen/EyeOpen";
import EyeClose from "@/components/EyeClose/EyeClose";
import AuthInput from "@/components/AuthInput/AuthInput";

const initialValues: LoginData = {
  email: "",
  password: "",
};

interface FormValues {
  email: string;
  password: string;
}

const schema = Yup.object({
  email: Yup.string().email(),
  password: Yup.string()
    .min(8, "Min 8 characters")
    .max(64, "Max 64 characters"),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    try {
      await login(values);
      // useUserStore.getState().setUser(existsUser);
      router.push("/transactions/expences");
    } catch (error) {
      console.error("Registration error:", error);
      actions.setSubmitting(false);
    }
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>Sign In</h1>
      <p className={css.text}>
        Step into a world of hassle-free expense management! Your journey
        towards financial mastery begins here.
      </p>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        <Form className={css.form}>
          <AuthInput name="email" type="email" placeholder="Email" />
          <AuthInput
            classNameContainer={css.formGroupPassword}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          >
            <div
              className={css.toggleEye}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOpen /> : <EyeClose />}
            </div>
          </AuthInput>
          <Button color={"green"} text={"Sign In"} />
        </Form>
      </Formik>
      <div className={css.signInRedirect}>
        <p className={css.textQuestion}>Already have account?</p>
        <Link className={css.link} href="/register">
          {" "}
          Sign Up
        </Link>
      </div>
    </div>
  );
}
