"use client"

import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {register, RegisterData} from "@/lib/api/clientAuthApi";
import css from "./SignUp.module.css"
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useUserStore} from "@/lib/store/useUserStore";
import {UserProfile} from "@/types/user";
import Button from "@/components/Button/Button";
import AuthInput from "@/components/AuthInput/AuthInput";
import EyeClose from "@/components/EyeClose/EyeClose";
import EyeOpen from "@/components/EyeOpen/EyeOpen";
import AuthPasswordInput from "@/components/AuthPasswordInput/AuthPasswordInput";
import AuthTextInput from "@/components/AuthTextInput/AuthTextInput";

const initialValues: RegisterData = {
    name: "",
    email: "",
    password: "",
};

interface FormValues {
    name: string;
    email: string;
    password: string;
}

const schema = Yup.object({
    name: Yup.string()
        .min(2, "Min 2 characters")
        .max(20, "Max 20 characters")
        .required("Name is required"),
    email: Yup.string().email().matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email must contain domain (e.g. .com)"
    )
        .required("Email is required").required("Email is required"),
    password: Yup.string()
        .min(8, "Min 8 characters")
        .max(64, "Max 64 characters"),
});

export default function SignUp() {
    const router = useRouter();

    const handleSubmit = async (
        values: FormValues,
        actions: FormikHelpers<FormValues>,
    ) => {
        try {
            await register(values);
            // const userProfile: UserProfile = {
            //     ...newUser,
            //     currency: "uah",
            //     avatarUrl: null,
            // };

            // useUserStore.getState().setUser(userProfile);

            router.push("/transactions/history");
        } catch (error) {
            console.error("Registration error:", error);
            actions.setSubmitting(false);
        }
    };



    return (
        <div className={css.container}>
            <h1 className={css.title}>Sign Up</h1>
            <p className={css.text}>Step into a world of hassle-free expense management! Your journey towards financial
                mastery begins
                here.</p>
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={schema}
            >
                {({errors,touched,submitCount}) => (
                    <Form className={css.form}>
                        <div className={css.inputsWrapper}>
                            <AuthTextInput errors={errors} touched={touched} submitCount={submitCount} name="name"
                                           placeholder="Name"/>
                            <AuthTextInput errors={errors} touched={touched} submitCount={submitCount} name="email"
                                           placeholder="Email"/>
                            <AuthPasswordInput name="password" placeholder="Password"/>
                        </div>
                        <Button color={"green"} text={"Sign Up"}/>
                    </Form>
                )}
            </Formik>
            <div className={css.signInRedirect}>
                <p className={css.textQuestion}>Already have account?</p>
                <Link className={css.link} href="/login"> Sign In</Link>
            </div>
        </div>
    );
}