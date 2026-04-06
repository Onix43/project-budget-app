import css from "./AuthTextInput.module.css"
import AuthInput from "@/components/AuthInput/AuthInput";
import AcceptIcon from "@/components/AcceptIcon/AcceptIcon";
import {FormikErrors, FormikTouched, FormikValues} from "formik";
import ErrorIcon from "@/components/ErrorIcon/ErrorIcon";

interface AuthTextInputProps {
    name: string;
    placeholder: string;
    touched: FormikTouched<FormikValues>;
    errors:  FormikErrors<FormikValues>;
    submitCount: number;
}

export default function AuthTextInput({touched,errors,submitCount,...props}:AuthTextInputProps) {
    return(
        <AuthInput
            type="text"
            {...props}
        >
            <div
                className={css.toggleValidation}
            >
                {touched[props.name] && errors[props.name] && submitCount > 0 && <ErrorIcon/>}
                {touched[props.name] && !errors[props.name] && submitCount > 0 && <AcceptIcon/>}
            </div>
        </AuthInput>
    );
}