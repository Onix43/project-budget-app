import Link from "next/link";
import css from "./Header.module.css";
import Image from "next/image";

export default function Header() { 
    return (

        <header className={css.header}>
            <Link href="/" className={css.logo}>
                <Image src="/logo-desktop.svg" alt="Logo" width={217} height={24} />
            </Link>
            <nav className={css.nav}>
                    <Link className={css.navItem + ' ' + css.active} href="/about">All Expense</Link>
                    <Link className={css.navItem} href="/services">All  Income</Link>
            </nav>
           
            <button
                className={css.UserBarBtn}
                type="button"

            >
                <Image className={css.userAvatar} src="/userAvatar.jpg" alt="User" width={44} height={44} />
                <p className={css.userName}>Alex Rybachok</p>
                <Image className={css.arrowIcon} src="/checked-icon.svg" alt="Arrow Down" width={20} height={20} />
            </button>
        </header>

    )
}