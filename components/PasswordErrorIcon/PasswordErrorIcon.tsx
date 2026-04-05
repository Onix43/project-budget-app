import Image from "next/image";
import css from "./PasswordErrorIcon.module.css";

export default function PasswordErrorIcon () {
    return <Image className={css.errorIcon} src={"/errorPass.svg"} alt={"errorPass"} width={16} height={16}/>
}