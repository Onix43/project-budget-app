import Image from "next/image";
import css from "./ErrorIcon.module.css";

export default function ErrorIcon () {
    return <Image className={css.errorIcon} src={"/errorPass.svg"} alt={"errorPass"} width={16} height={16}/>
}