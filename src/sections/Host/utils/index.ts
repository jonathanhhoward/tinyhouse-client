import { displayErrorMessage } from "../../../lib/utils";

export function beforeImageUpload(file: File) {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 1MB in size!"
    );
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
}

export function getBase64Value(
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => callback(reader.result as string);
}
