"use client";

import css from "./Header.module.css";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Modal from "../Modal/Modal";
import UserSetsModal from "../UserSetsModal/UserSetsModal";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import LogOut from "../LogOut/LogOut";
import { useUserStore } from "@/lib/store/useUserStore";

export default function Header() {
  const isAuthenficated = useUserStore((state) => state.isAuthenticated);

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isUserSetsModalOpen, setIsUserSetsModalOpen] = useState(false);
  const [isopenLogOutModal, setIsOpenLogOutModal] = useState(false);

  
  const openSettings = () => {
    setIsUserSetsModalOpen(true);
    setIsBurgerOpen(false); 
  };

  const openLogOutModal = () => {
    setIsOpenLogOutModal(true);
    setIsBurgerOpen(false); 
  }

  return (
    <header className={css.header}>
      <Link href="/" className={`${ css.logo } ${!isAuthenficated ? css.logoCentered : ''}`}>
        <Image className={css.logoMobile} src="/logo-mobile.svg" alt="Logo" width={199} height={22} />
        <Image className={css.logoTablet} src="/logo-desktop.svg" alt="Logo" width={217} height={24} />
      </Link>
      {isAuthenficated && (
        <>
           <div className={css.navWrapper}>
        <TransactionsHistoryNav />
      </div>

      <div className={css.userWrapper}>
        <UserBarBtn onProfileClick={openSettings} onLogoutClick={openLogOutModal}/>
      </div>

      <button className={css.burgerBtn} onClick={() => setIsBurgerOpen(true)}>
        <Image src="/burger.svg" alt="Menu" width={36} height={36} />
      </button>
        </>
      )}

      

      {/* Бургер-меню */}
      {isAuthenficated && isBurgerOpen && (
        <div className={css.modalBackdrop}>
          <div className={css.mobileMenu}>
            <button className={css.closeBtn} onClick={() => setIsBurgerOpen(false)}>
              <Image className={css.closeBtnIcon} src="/btnClose.svg" alt="Close" width={20} height={20} />
            </button>
            <div className={css.mobileUserWrapper}>
              <UserBarBtn onProfileClick={openSettings} onLogoutClick={openLogOutModal}/>
            </div>
            <div className={css.mobileNavWrapper}>
              <TransactionsHistoryNav onClose={() => setIsBurgerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Модалка рендериться настройки профиля*/}
      {isAuthenficated && isUserSetsModalOpen && (
        <Modal onClose={() => setIsUserSetsModalOpen(false)}>
          <UserSetsModal />
        </Modal>
      )}
      { /* Модалка Выхода рендериться  */}
      {isAuthenficated && isopenLogOutModal && (
        <Modal onClose={() => setIsOpenLogOutModal(false)}>
          <LogOut  onClose={()=>setIsOpenLogOutModal(false)}/>
        </Modal>
      )}
    </header>
  );
}
