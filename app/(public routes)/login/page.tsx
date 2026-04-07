"use client";

import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { login, LoginData } from "@/lib/api/clientAuthApi";
import css from "./SignIn.module.css";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import AuthPasswordInput from "@/components/AuthPasswordInput/AuthPasswordInput";
import AuthTextInput from "@/components/AuthTextInput/AuthTextInput";
import "izitoast/dist/css/iziToast.min.css";
import Loader from "@/app/loader";
import { UserProfile } from "@/types/user";
import BgImageWrapper from "@/components/BgImageWrapper/BgImageWrapper";
import DecorationTab from "@/components/DecorationTab/DecorationTab";

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
    .max(20, "Max 64 characters"),
});

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    actions.setSubmitting(true);
    try {
      const existsUser = await login(values);
      const user: UserProfile = {
        name: existsUser.name,
        currency: existsUser.currency,
        avatarUrl: existsUser.avatarUrl,
      };
      useUserStore.getState().setUser(user);
      router.push("/transactions/history");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data.response.message ||
        error?.response?.data.response.error ||
        error?.response?.data.response.errors?.[0] ||
        "Registration failed";

      const iziToast = (await import("izitoast")).default;
      iziToast.error({
        title: "Error",
        message: errorMessage,
        position: "bottomRight",
        timeout: 3000,
        displayMode: 2,
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className={css.container}>
      <div>
        <h1 className={css.title}>Sign In</h1>
        <p className={css.text}>
          Welcome back to effortless expense tracking! Your financial dashboard
          awaits.
        </p>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ errors, touched, submitCount, isSubmitting }) => (
            <Form className={css.form}>
              <div className={css.inputsWrapper}>
                <AuthTextInput
                  errors={errors}
                  touched={touched}
                  submitCount={submitCount}
                  name="email"
                  placeholder="Email"
                />
                <AuthPasswordInput
                  errors={errors}
                  touched={touched}
                  submitCount={submitCount}
                  name="password"
                  placeholder="Password"
                />
              </div>
              {isSubmitting && <Loader />}
              <Button color={"green"} text={"Sign In"} />
            </Form>
          )}
        </Formik>
        <div className={css.signUpRedirect}>
          <p className={css.textQuestion}>Don’t have an account?</p>
          <Link className={css.link} href="/register">
            {" "}
            Sign Up
          </Link>
        </div>
      </div>
      <div className={css.banner}>
        <BgImageWrapper />
        <DecorationTab className={css.bannerDecorationTab} />
      </div>
    </div>
  );
}
