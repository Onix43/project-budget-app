"use client"

import { Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {login, LoginData} from "@/lib/api/clientAuthApi";
import css from "./SignIn.module.css"
import {useState} from "react";
import Link from "next/link";
import Button from "@/components/Button/Button";
import {useUserStore} from "@/lib/store/useUserStore";
import {useRouter} from "next/navigation";
import EyeOpen from "@/components/EyeOpen/EyeOpen";
import EyeClose from "@/components/EyeClose/EyeClose";
import AuthInput from "@/components/AuthInput/AuthInput";
import ErrorIcon from "@/components/ErrorIcon/ErrorIcon";
import PasswordAcceptIcon from "@/components/AcceptIcon/AcceptIcon";
import AuthPasswordInput from "@/components/AuthPasswordInput/AuthPasswordInput";
import AuthTextInput from "@/components/AuthTextInput/AuthTextInput";

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
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (
        values: FormValues,
        actions: FormikHelpers<FormValues>,
    ) => {
        try {
            await login(values);
            // useUserStore.getState().setUser(existsUser);
            router.push("/transactions/history");
        } catch (error) {
            setIsError(true);
            actions.setSubmitting(false);
        }
    };

    return (
        <div className={css.container}>
            <h1 className={css.title}>Sign In</h1>
            <p className={css.text}>
                Welcome back to effortless expense tracking! Your financial dashboard awaits.
            </p>
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={schema}
            >
                {({errors,touched, submitCount}) => (
                <Form className={css.form}>
                    <div className={css.inputsWrapper}>
                        <AuthTextInput errors={errors} touched={touched} submitCount={submitCount} name="email" placeholder="Email"/>
                        <AuthPasswordInput name="password" placeholder="Password"/>
                    </div>
                    <Button color={"green"} text={"Sign In"}/>
                </Form>
                )}
            </Formik>
            <div className={css.signInRedirect}>
                <p className={css.textQuestion}>Don’t have an account?</p>
                <Link className={css.link} href="/register"> Sign Up</Link>
            </div>
        </div>
    );
}