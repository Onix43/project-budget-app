import css from "./AuthPasswordInput.module.css"
import EyeOpen from "@/components/EyeOpen/EyeOpen";
import EyeClose from "@/components/EyeClose/EyeClose";
import AuthInput from "@/components/AuthInput/AuthInput";
import {useState} from "react";

interface AuthPasswordInputProps {
    name: string;
    placeholder: string;
}
export default function AuthPasswordInput(props:AuthPasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    return(
        <AuthInput
            type={showPassword ? "text" : "password"}
            {...props}
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