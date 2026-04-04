"use client"
import Link from "next/link";
import Button from "@/components/Button/Button";
import BgImageWrapper from "@/components/BgImageWrapper/BgImageWrapper";
import DecorationTab from "@/components/DecorationTab/DecorationTab";
import css from "./Home.module.css"


export default function Home() {
    return (
        <div className={css.container}>
            <div className={css.infoBlock}>
                <p className={css.text}>Expense Log</p>
                <h1 className={css.title}>Manage Your <span>Finances</span> Masterfully!</h1>
                <p className={css.subtext}>ExpenseTracker effortlessly empowers you to take control of your finances!
                    With intuitive features, it
                    simplifies the process of tracking and managing expenses, allowing for a stress-free mastery over
                    your
                    financial world.</p>
            </div>
            <div className={css.links}>
                <Link href="/register">
                    <Button color={"green"} text={"Sign Up"} onClick={() => {
                    }}/>
                </Link>
                <Link href="/login">
                    <Button color={"dark"} text={"Sign In"} onClick={() => {
                    }}/>
                </Link>
            </div>
            <div className={css.banner}>
                <BgImageWrapper/>
                <DecorationTab className={css.bannerDecorationTab}/>
            </div>
        </div>
    );
}
