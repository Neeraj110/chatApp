import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("Cloudinary credentials are missing in .env file");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

interface UploadOptions {
  folder?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
  public_id?: string;
  overwrite?: boolean;
  transformation?: object[];
}

export const uploadOnCloudinary = async (
  localFilePath: string,
  options: UploadOptions = {}
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    const response: UploadApiResponse = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
        ...options,
      }
    );

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export const deleteOnCloudinary = async (
  url: string
): Promise<{ result: string } | null> => {
  try {
    if (!url) return null;

    const parts = url.split("/");
    const public_id_with_ext = parts.slice(-2).join("/");
    const public_id = public_id_with_ext.split(".")[0];

    let resource_type: "image" | "video" | "raw" = "image";

    if (url.includes("/video/")) {
      resource_type = "video";
    } else if (url.includes("/raw/")) {
      resource_type = "raw";
    }

    return await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};
