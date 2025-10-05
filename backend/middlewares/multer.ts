import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "./backend/public/temp");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

const avatarFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, WEBP images allowed for avatar"));
  }
  cb(null, true);
};

const chatFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/avi",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error(`File type ${file.mimetype} not allowed for chat`));
  }
  cb(null, true);
};

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: avatarFilter,
});

export const chatUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024, files: 5 },
  fileFilter: chatFileFilter,
});

export const uploadUserAvatar = avatarUpload.single("avatar");
export const uploadGroupAvatar = avatarUpload.single("groupAvatar");
export const uploadSingleChat = chatUpload.single("media");
export const uploadMultipleChat = chatUpload.array("media", 5);
