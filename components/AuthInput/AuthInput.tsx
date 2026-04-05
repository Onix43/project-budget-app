import css from "./AuthInput.module.css"
import {ErrorMessage, Field} from "formik";
import {JSX} from "react";

interface AuthInputProps {
    name:string;
    type:string;
    placeholder:string;
    children?: JSX.Element;
    classNameContainer?:string;
}

export default function AuthInput({classNameContainer,children,...props}:AuthInputProps) {
    return(
        <div className={classNameContainer ?`${css.formGroup} ${classNameContainer}`: css.formGroup}>
            <Field
                className={css.input}
                {...props}
            />
            {children}
            <ErrorMessage component="span" name={props.name} className={css.error}/>
            {}
        </div>
    );
}