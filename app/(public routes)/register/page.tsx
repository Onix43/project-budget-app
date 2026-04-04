"use client"

import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {RegisterData} from "@/lib/api/clientAuthApi";
import css from "./SignUp.module.css"
import {useId, useState} from "react";
import Link from "next/link";

const initialValues: RegisterData = {
    name: "",
    email: "",
    password: "",
};

const schema = Yup.object({
    name: Yup.string()
        .min(2, "Min 2 characters")
        .max(32, "Max 32 characters")
        .required("Name is required"),
    email: Yup.string().email(),
    password: Yup.string()
        .min(8, "Min 8 characters")
        .max(64, "Max 64 characters"),
});

const EyeOpen = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0.833252 10C0.833252 10 4.16659 3.33337 9.99992 3.33337C15.8333 3.33337 19.1666 10 19.1666 10C19.1666 10 15.8333 16.6667 9.99992 16.6667C4.16659 16.6667 0.833252 10 0.833252 10Z"
            stroke="#FAFAFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path
            d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
            stroke="#FAFAFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);

const EyeClosed = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_74_3202)">
            <path
                d="M11.9603 11.96C10.8207 12.8286 9.43307 13.3099 8.00033 13.3333C3.33366 13.3333 0.666992 7.99998 0.666992 7.99998C1.49625 6.45457 2.64642 5.10438 4.04033 4.03998M6.60033 2.82664C7.05921 2.71923 7.52904 2.66554 8.00033 2.66664C12.667 2.66664 15.3337 7.99998 15.3337 7.99998C14.929 8.75705 14.4464 9.4698 13.8937 10.1266M9.41366 9.41331C9.23056 9.60981 9.00976 9.76741 8.76443 9.87672C8.5191 9.98604 8.25426 10.0448 7.98572 10.0496C7.71718 10.0543 7.45044 10.0049 7.2014 9.9043C6.95237 9.80371 6.72614 9.65399 6.53622 9.46408C6.34631 9.27416 6.19659 9.04794 6.096 8.7989C5.99541 8.54987 5.94601 8.28312 5.95075 8.01458C5.95549 7.74604 6.01427 7.48121 6.12358 7.23587C6.23289 6.99054 6.3905 6.76974 6.58699 6.58664"
                stroke="#FAFAFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M0.666992 0.666626L15.3337 15.3333" stroke="#FAFAFA" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"/>
        </g>
        <defs>
            <clipPath id="clip0_74_3202">
                <rect width="16" height="16" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const id = useId();
    return (
        <div className={css.container}>
            <h1 className={css.title}>Sign Up</h1>
            <p className={css.text}>Step into a world of hassle-free expense management! Your journey towards financial
                mastery begins
                here.</p>
            <Formik
                initialValues={initialValues}
                onSubmit={() => {
                }}
                validationSchema={schema}
            >
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <Field
                            id={`${id}-name`}
                            type="text"
                            name="name"
                            placeholder="Name"
                            className={css.input}
                        />
                        <ErrorMessage name="name" component="span" className={css.error}/>
                    </div>

                    <div className={css.formGroup}>
                        <Field
                            id={`${id}-content`}
                            name="content"
                            type="email"
                            placeholder="Email"
                            className={css.input}
                        />
                        <ErrorMessage component="span" name="email" className={css.error}/>
                    </div>

                    <div className={`${css.formGroup} ${css.formGroupPassword}`}>
                        <Field
                            id={`${id}-password`}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className={css.input}
                        />
                        <div
                            className={css.toggleEye}
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOpen/> : <EyeClosed/>}
                        </div>
                        <ErrorMessage name="password" component="span" className={css.error}/>
                    </div>
                    <button type="submit" className={css.submitButton}>
                        Sign Up
                    </button>
                </Form>
            </Formik>
            <p className={css.textQuestion}>Already have account?</p>
        </div>
    );
}