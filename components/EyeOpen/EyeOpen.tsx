import Image from "next/image";
import css from "./EyeOpen.module.css"

export default function EyeOpen() {
    return <Image className={css.eyeOpen} src={"/eyeOpen.svg"} alt={"eyeCloseSvg"} width={16} height={16}/>
}