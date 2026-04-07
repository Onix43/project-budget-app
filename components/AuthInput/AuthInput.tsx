import css from "./AuthInput.module.css"
import {ErrorMessage, Field} from "formik";
import {JSX} from "react";

interface AuthInputProps {
    name: string;
    type: string;
    placeholder: string;
    children?: JSX.Element;
    classNameContainer?: string;
    classNameInput?: string;
    isError: boolean;
    isValid: boolean;
}

export default function AuthInput({isError,isValid,classNameInput,classNameContainer, children, ...props}: AuthInputProps) {
    return (
        <div
            className={
                classNameContainer
                    ? `${css.formGroup} ${css.formGroupInput} ${classNameContainer}`
                    : `${css.formGroup} ${css.formGroupInput}`
            }
        >
            <Field
                className={`
                    ${css.input}
                    ${classNameInput || ""}
                    ${isError ? css.errorBorder : undefined}
                    ${isValid ? css.validBorder : undefined}
                   `}
                {...props}
            />

            {children}

            <ErrorMessage component="span" name={props.name} className={css.error} />
        </div>
    );
}