"use client";
import Button from "@/components/Button/Button";
import css from "./test.module.css";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  // Хуки для керування станом
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [name, setName] = useState("");

  // Обробник зміни валюти
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
    setIsSelectOpen(false); // Закриваємо "віртуально" (ховаємо поворот) після вибору
    e.target.blur(); // Знімаємо фокус, щоб стрілка повернулася назад
  };

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
          <div className={css.selectWrapper}>
            <select
              id="currency"
              className={css.selectField}
              name="currency"
              value={currency}
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
              onChange={handleCurrencyChange}
            >
              <option value="uah">&#8372; UAH</option>
              <option value="usd"> &#36; USD</option>
              <option value="eur"> &#8364; EUR</option>
            </select>
            <Image
              src="/arrow-down.svg"
              alt="arrow"
              width={16}
              height={16}
              className={`${css.arrowIcon} ${isSelectOpen ? css.rotated : ""}`}
            />
          </div>
        </div>

        {/* Блок імені */}
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
        onClick={() => console.log({ name, currency })}
      />
    </div>
  );
}
