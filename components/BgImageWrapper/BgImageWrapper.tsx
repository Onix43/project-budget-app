import Image from "next/image";
import banner from "@/public/welcomepage.webp";
import css from "./BgImageWrapper.module.css";

export default function BgImageWrapper(){
    return <Image className={css.image} src={banner} alt="Welcome Page"/>
}