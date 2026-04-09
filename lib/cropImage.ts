import { Area } from "react-easy-crop";

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName: string = "avatar.jpg"
): Promise<File | null> => {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

    const canvas = document.createElement("canvas");
    canvas.width = 400
    canvas.height = 400
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Малюємо частину зображення на канвас
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    400,
    400,
  );

  // Якщо хочеш примусово 400x400 (для стабільності), розкоментуй код нижче:
  /*
  const outCanvas = document.createElement("canvas");
  outCanvas.width = 400;
  outCanvas.height = 400;
  const outCtx = outCanvas.getContext("2d");
  outCtx?.drawImage(canvas, 0, 0, 400, 400);
  const finalCanvas = outCanvas;
  */
  const finalCanvas = canvas;

  return new Promise((resolve) => {
    finalCanvas.toBlob((blob) => {
      if (!blob) return resolve(null);
      const file = new File([blob], fileName, { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg", 0.9);
  });
};
