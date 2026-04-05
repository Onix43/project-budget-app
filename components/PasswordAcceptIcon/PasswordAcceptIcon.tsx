import Image from "next/image";
import css from "./PasswordAcceptIcon.module.css";

export default function PasswordAcceptIcon () {
    return <Image className={css.acceptIcon} src={"/acceptedPass.svg"} alt={"acceptedPass"} width={16} height={16}/>
}