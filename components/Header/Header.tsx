"use client";

import css from "./Header.module.css";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Button from "../Button/Button";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleAllExpense = () => {
    router.push("/transactions/expense");
  };

  const handleAllIncome = () => {
    router.push("/transactions/income");
  };

  const isActive = (path: string) => pathname === path;

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    console.log("Стан меню:", !isDropdownOpen);
  };

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

      <nav className={css.nav}>
        <Button
          className={css.navItem}
          text="All Expense"
          onClick={handleAllExpense}
          color={isActive("/transactions/expense") ? "green" : "dark"}
        />
        <Button
          className={css.navItem}
          text="All Income"
          onClick={handleAllIncome}
          color={isActive("/transactions/income") ? "green" : "dark"}
        />
      </nav>
      {/* Меню Юзера  */}
      <div className={css.userWrapper}>
        <button
          className={css.UserBarBtn}
          type="button"
          onClick={toggleDropdown}
        >
          <Image
            className={css.userAvatar}
            src="/userAvatar.jpg"
            alt="User"
            width={44}
            height={44}
          />
          <p className={css.userName}>Alex Rybachok</p>
          <Image
            className={isDropdownOpen ? css.arrowRotate : ""}
            src="/checked-icon.svg"
            alt="Arrow Down"
            width={20}
            height={20}
          />
        </button>

        {/* Випадаюче меню*/}
        {isDropdownOpen && (
          <div className={css.dropdown}>
            <button className={css.dropdownBtn} type="button">
              <svg
                className={css.dropdownIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3333 14V12.6667C13.3333 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.3739 10 10.6667 10H5.33334C4.62609 10 3.94782 10.281 3.44772 10.781C2.94762 11.2811 2.66667 11.9594 2.66667 12.6667V14"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.99999 7.33333C9.47275 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47275 2 7.99999 2C6.52724 2 5.33333 3.19391 5.33333 4.66667C5.33333 6.13943 6.52724 7.33333 7.99999 7.33333Z"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <p>Profile settings</p>
            </button>
            <button className={`${css.dropdownBtn}`} type="button">
              <svg
                className={css.dropdownIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.6667 11.3334L14 8.00002L10.6667 4.66669"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 8H6"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p>Log out</p>
            </button>
          </div>
        )}
      </div>

      {/* Кнопка Бургерf  */}
      <button className={css.burgerBtn} onClick={() => setIsBurgerOpen(true)}>
        <Image src="/burger.svg" alt="Menu" width={36} height={36} />
      </button>

      {/* Модалка  */}
      {isBurgerOpen && (
        <div className={css.modalBackdrop}>
          <div className={css.mobileMenu}>
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

           
              <button
                className={css.UserBarBtn}
                type="button"
                onClick={toggleDropdown}
              >
                <Image
                  className={css.userAvatar}
                  src="/userAvatar.jpg"
                  alt="User"
                  width={44}
                  height={44}
                />
                <p className={css.userName}>Alex Rybachok</p>
                <Image
                  className={isDropdownOpen ? css.arrowRotate : ""}
                  src="/checked-icon.svg"
                  alt="Arrow Down"
                  width={20}
                  height={20}
                />
              </button>

              {/* Випадаюче меню*/}
              {isDropdownOpen && (
                <div className={css.dropdown}>
                  <button className={css.dropdownBtn} type="button">
                    <svg
                      className={css.dropdownIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3333 14V12.6667C13.3333 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.3739 10 10.6667 10H5.33334C4.62609 10 3.94782 10.281 3.44772 10.781C2.94762 11.2811 2.66667 11.9594 2.66667 12.6667V14"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.99999 7.33333C9.47275 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47275 2 7.99999 2C6.52724 2 5.33333 3.19391 5.33333 4.66667C5.33333 6.13943 6.52724 7.33333 7.99999 7.33333Z"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p>Profile settings</p>
                  </button>
                  <button className={`${css.dropdownBtn}`} type="button">
                    <svg
                      className={css.dropdownIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.6667 11.3334L14 8.00002L10.6667 4.66669"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 8H6"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p>Log out</p>
                  </button>
                </div>
              )}
            </div>

            <div className={css.mobileNav}>
              <Button
                className={`${css.mobileNavItem} ${isActive("/transactions/expense") ? css.activeBorder : ""}`}
                text="All Expense"
                onClick={() => {
                  handleAllExpense();
                  setIsBurgerOpen(false);
                }}
                color={isActive("/transactions/expense") ? "green" : "dark"}
              />

              <Button
                className={`${css.mobileNavItem} ${isActive("/transactions/income") ? css.activeBorder : ""}`}
                text="All Income"
                onClick={() => {
                  handleAllIncome();
                  setIsBurgerOpen(false);
                }}
                color={isActive("/transactions/income") ? "green" : "dark"}
              />
            </div>
          </div>
      )}
    </header>
  );
}
