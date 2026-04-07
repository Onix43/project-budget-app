import css from "./AuthTextInput.module.css"
import AuthInput from "@/components/AuthInput/AuthInput";
import AcceptIcon from "@/components/AcceptIcon/AcceptIcon";
import {FormikErrors, FormikTouched, FormikValues} from "formik";
import ErrorIcon from "@/components/ErrorIcon/ErrorIcon";

interface AuthTextInputProps {
    name: string;
    placeholder: string;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
    submitCount: number;
}

export default function AuthTextInput({touched, errors, submitCount, ...props}: AuthTextInputProps) {
    const hasError = Boolean(touched[props.name] && errors[props.name] && submitCount > 0);
    const isValid = Boolean(touched[props.name] && !errors[props.name] && submitCount > 0);

    return (
        <AuthInput
            type="text"
            {...props}
            isError={hasError}
            isValid={isValid}
        >
            <div className={css.toggleValidation}>
                {hasError && <ErrorIcon />}
                {isValid && <AcceptIcon />}
            </div>
        </AuthInput>
    );
}