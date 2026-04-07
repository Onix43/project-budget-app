import css from "./AuthPasswordInput.module.css"
import EyeOpen from "@/components/EyeOpen/EyeOpen";
import EyeClose from "@/components/EyeClose/EyeClose";
import AuthInput from "@/components/AuthInput/AuthInput";
import {useState} from "react";
import {FormikErrors, FormikTouched, FormikValues} from "formik";

interface AuthPasswordInputProps {
    name: string;
    placeholder: string;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
    submitCount: number;
}
export default function AuthPasswordInput({touched, errors, submitCount, ...props}:AuthPasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const hasError = Boolean(touched[props.name] && errors[props.name] && submitCount > 0);
    const isValid = Boolean(touched[props.name] && !errors[props.name] && submitCount > 0);
    return(
        <AuthInput
            type={showPassword ? "text" : "password"}
            {...props}
            isError={hasError}
            isValid={isValid}
        >
            <div
                className={css.toggleEye}
                onClick={() => setShowPassword(prev => !prev)}
            >
                {showPassword ? <EyeOpen/> : <EyeClose/>}
            </div>
        </AuthInput>
    );
}