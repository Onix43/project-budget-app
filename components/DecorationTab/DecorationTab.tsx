import Image from "next/image";
import decorate from "@/public/decorationtab.jpg"
import css from "./DecorationTab.module.css";

interface DecorationTabProps {
    className: string;
}

export default function DecorationTab({className}:DecorationTabProps){
    return <Image className={`${css.image} ${className}`} src={decorate} alt="Welcome Page"/>}