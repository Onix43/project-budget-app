"use client";
import css from "./UserBarBtn.module.css";

import { useState } from "react";
import Image from "next/image";

import { useUserStore } from "@/lib/store/useUserStore";

interface UserBarBtnProps {
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function UserBarBtn({
  onProfileClick,
  onLogoutClick,
}: UserBarBtnProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = useUserStore((state) => state.user);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    console.log("Стан меню:", !isDropdownOpen);
  };

  const handleProfileClick = () => {
    if (onProfileClick) onProfileClick();
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    if (onLogoutClick) onLogoutClick();
    setIsDropdownOpen(false);
  };

  return (
    <>
      <button className={css.UserBarBtn} type="button" onClick={toggleDropdown}>
        <Image
          className={css.userAvatar}
          src={user?.avatarUrl || "/default-user-avatar.png"}
          alt="User"
          width={34}
          height={34}
        />
        <p className={css.userName}>{user?.name || "User"}</p>
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
          <button
            className={css.dropdownBtn}
            type="button"
            onClick={handleProfileClick}
          >
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
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.99999 7.33333C9.47275 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47275 2 7.99999 2C6.52724 2 5.33333 3.19391 5.33333 4.66667C5.33333 6.13943 6.52724 7.33333 7.99999 7.33333Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p>Profile settings</p>
          </button>
          <button
            className={`${css.dropdownBtn}`}
            type="button"
            onClick={() => {
              if (onLogoutClick) handleLogoutClick();
              setIsDropdownOpen(false);
            }}
          >
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
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6667 11.3334L14 8.00002L10.6667 4.66669"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8H6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Log out</p>
          </button>
        </div>
      )}
    </>
  );
}
