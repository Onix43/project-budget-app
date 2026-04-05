"use client";

import css from "./Header.module.css";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


import UserBarBtn from "../UserBarBtn/UserBarBtn";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";

export default function Header() {
  
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  

  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        <Image
          className={css.logoMobile}
          src="/logo-mobile.svg"
          alt="Logo"
          width={199}
          height={22}
        />
        <Image
          className={css.logoTablet}
          src="/logo-desktop.svg"
          alt="Logo"
          width={217}
          height={24}
        />
      </Link>
      {/* Навигация  */}
      <div className={css.navWrapper}>
        <TransactionsHistoryNav />
      </div>
      {/* Меню Юзера  */}
      <div className={css.userWrapper}>
       <UserBarBtn/>
      </div>

      {/* Кнопка Бургерf  */}
      <button className={css.burgerBtn} onClick={() => setIsBurgerOpen(true)}>
        <Image src="/burger.svg" alt="Menu" width={36} height={36} />
      </button>

      {/* Модалка  */}
      {isBurgerOpen && (
        <div className={css.modalBackdrop}>
          <div className={css.mobileMenu}>
            { /* кнопка закрытия модалки */}
            <button
              className={css.closeBtn}
              onClick={() => setIsBurgerOpen(false)}
            >
              <Image
                className={css.closeBtnIcon}
                src="/btnClose.svg"
                alt="Close"
                width={20}
                height={20}
              />
            </button>
            { /* Меню юзера в модалке*/}
            
            <div className={css.mobileUserWrapper}>
              <UserBarBtn />
            </div>
            
            { /* Навигация в модалке*/}
            <div className={css.mobileNavWrapper}>
              <TransactionsHistoryNav />
            </div>
            

           
            </div>

            
          </div>
      )}
    </header>
  );
}
