import Image from "next/image";
import css from "./AcceptIcon.module.css";

export default function AcceptIcon() {
    return <Image className={css.acceptIcon} src={"/acceptedPass.svg"} alt={"acceptedPass"} width={16} height={16}/>
}