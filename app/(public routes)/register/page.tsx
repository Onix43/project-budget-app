"use client"

import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {register, RegisterData} from "@/lib/api/clientAuthApi";
import css from "./SignUp.module.css"
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useUserStore} from "@/lib/store/useUserStore";
import {UserProfile} from "@/types/user";
import Button from "@/components/Button/Button";
import AuthPasswordInput from "@/components/AuthPasswordInput/AuthPasswordInput";
import AuthTextInput from "@/components/AuthTextInput/AuthTextInput";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import Loader from "@/app/loader";
import {log} from "node:util";
import BgImageWrapper from "@/components/BgImageWrapper/BgImageWrapper";
import DecorationTab from "@/components/DecorationTab/DecorationTab";

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
    email: Yup.string()
        .email("Invalid email format")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must contain domain (e.g. .com)")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Min 8 characters")
        .max(64, "Max 64 characters")
        .required("Password is required"),
});

export default function SignUp() {
    const router = useRouter();

    const handleSubmit = async (
        values: FormValues,
        actions: FormikHelpers<FormValues>,
    ) => {
        actions.setSubmitting(true);
        try {
            const newUser = await register(values);
            const userProfile: UserProfile = {
                name: newUser.name,
                currency: "uah",
                avatarUrl: null,
            };

            useUserStore.getState().setUser(userProfile);

            router.push("/transactions/history");
        } catch (error:any) {
            console.error("Registration error:", error);
            const errorMessage =
                error?.response?.data.response.message ||
                error?.response?.data.response.error ||
                error?.response?.data.response.errors?.[0] ||
                "Registration failed";

            iziToast.error({
                title: "Error",
                message: errorMessage,
                position: "bottomRight",
                timeout: 3000,
                displayMode: 2
            });
        } finally {
            actions.setSubmitting(false);
        }
    };



    return (
        <div className={css.container}>
            <div>
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
                {({errors,touched,submitCount,isSubmitting}) => (
                    <Form className={css.form}>
                        <div className={css.inputsWrapper}>
                            <AuthTextInput errors={errors} touched={touched} submitCount={submitCount} name="name"
                                           placeholder="Name"/>
                            <AuthTextInput errors={errors} touched={touched} submitCount={submitCount} name="email"
                                           placeholder="Email"/>
                            <AuthPasswordInput errors={errors} touched={touched} submitCount={submitCount} name="password"
                                               placeholder="Password"/>
                        </div>
                        {isSubmitting && <Loader />}
                        <Button color={"green"} text={"Sign Up"}/>
                    </Form>
                )}
            </Formik>
            <div className={css.signInRedirect}>
                <p className={css.textQuestion}>Already have account?</p>
                <Link className={css.link} href="/login"> Sign In</Link>
            </div>
            </div>
            <div className={css.banner}>
                <BgImageWrapper/>
                <DecorationTab className={css.bannerDecorationTab}/>
            </div>
        </div>
    );
}