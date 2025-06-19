import multer from "multer";
import { config } from "../../config";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (file: Express.Multer.File) => {
    return {
      folder: "user-profile-pics",
      format: "png", // supports promises as well
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
