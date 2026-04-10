import Image from "next/image";
import desktop from "@/public/banner-desktop.webp";
import tablet from "@/public/banner-tablet.webp";
import mobile from "@/public/banner-mobile.webp";
import css from "./BgImageWrapper.module.css";

export default function BgImageWrapper() {
    return (
        <picture>
            <source media="(max-width: 768px)" srcSet={mobile.src} />
            <source media="(max-width: 1024px)" srcSet={tablet.src} />

            <Image
                className={css.image}
                src={desktop}
                alt="Welcome Page"
            />
        </picture>
    );
}