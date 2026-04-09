"use client";
import css from "./AvatarCropper.module.css";

import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage"; // путь к файлу из Шага 1
import Button from "../Button/Button";

interface Props {
  image: string; // ссылка на файл, который выбрал юзер
  onSave: (file: File) => void; // вернет готовый файл наружу
  onCancel: () => void;
}

export default function AvatarCropper({ image, onSave, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

const handleDone = async () => {
  if (!croppedAreaPixels) return;
  
  // Дожидаемся файла
  const croppedFile = await getCroppedImg(image, croppedAreaPixels, "user-avatar.jpg");
  
  // Если файл успешно создан, передаем его в onSave
  if (croppedFile) {
    onSave(croppedFile); 
  }
};

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
      <div className={css.wrapper}>
          <p className={css.title}>Choose your photo</p>
      <div className={css.cropContainer}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
                  cropShape="round"
                  showGrid={false}
                  classes={{ containerClassName: css.cropperObject }} 
                   minZoom={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className={css.controls}>
              <input
                  className={css.slider}
          type="range"
          min={0.5}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
              <div className={css.wrapperBtn}>
                  <Button className={css.btn} onClick={handleDone} color="green" text="Change avatar" />
                  <Button className={css.btn} onClick={onCancel} color="gray" text="Cancel"/>

        </div>
      </div>
    </div>
  );
}

//<Button className={css.btnChange} onClick={handleDone} color="green" text="Change avatar" />
                //  <Button className={css.btnCancel} onClick={onCancel} color="gray" text="Cancel"/>
