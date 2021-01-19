import { displayErrorMessage } from "../../../lib/utils";

export function beforeImageUpload(file: File) {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  if (!fileIsValidImage)
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");

  const fileIsValidSize = file.size / 1024 / 1024 < 2;
  if (!fileIsValidSize) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 2MB in size!"
    );
  }

  return fileIsValidImage && fileIsValidSize;
}

export function getBase64Value(
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
