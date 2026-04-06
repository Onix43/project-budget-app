import Image from "next/image";
import css from "./EyeClose.module.css"

export default function EyeClose() {
    return <Image className={css.eyeClose} src={"/eyeClose.svg"} alt={"eyeCloseSvg"} width={16} height={16}/>

}