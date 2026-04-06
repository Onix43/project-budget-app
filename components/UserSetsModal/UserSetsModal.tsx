"use client";
import Button from "@/components/Button/Button";
import css from "./UserSetsModal.module.css";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  // Хуки для керування станом
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState({ code: "UAH", symbol: "₴" });

  const currencies = [
    { code: "UAH", symbol: "₴" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
  ];
  const [name, setName] = useState("");


  return (
    <div className={css.container}>
      <h2 className={css.profileTitle}>Profile settings</h2>

      <div className={css.profileAvatare}>
        <Image
          className={css.profileAvatareImg}
          src="/default-user-avatar.png"
          alt="Profile Avatar"
          width={100}
          height={100}
        />
        <div className={css.AvatareBtnWraper}>
          <Button
            className={css.AvatareBtn}
            color="gray"
            text="Upload new photo"
            onClick={() => console.log("Upload photo")}
          />
          <Button
            className={css.AvatareBtn}
            color="gray"
            text="Remove"
            onClick={() => console.log("Remove photo")}
          />
        </div>
      </div>

      <div className={css.profileSettings}>
        {/* Блок Валюти */}
        <div className={css.profileCurrency}>
          <div className={css.selectWrapper} onClick={() => setIsOpen(!isOpen)}>
            <span className={css.selectedValue}>
              <span className={css.symbol}>{selected.symbol}</span>{" "}
              {selected.code}
            </span>
            <Image
              src="/arrow-down.svg"
              alt="arrow"
              width={16}
              height={16}
              className={`${css.arrowIcon} ${isOpen ? css.rotated : ""}`}
            />
          </div>

          {/* Доп список */}
          {isOpen && (
            <ul className={css.customOptionsList}>
              {currencies.map((curr) => (
                <li
                  key={curr.code}
                  className={`${css.optionItem} ${selected.code === curr.code ? css.activeOption : ""}`}
                  onClick={() => {
                    setSelected(curr);
                    setIsOpen(false);
                  }}
                >
                  <span className={css.optionSymbol}>{curr.symbol}</span>{" "}
                  {curr.code}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Блок ввода имени */}
        <div className={css.profileName}>
          <input
            id="name"
            name="name"
            type="text"
            className={css.nameInput}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <Button
        className={css.btnSave}
        color="green"
        text="Save"
        onClick={() => console.log("Save settings")}
      />
    </div>
  );
}
