import multer from "multer";
import { Request } from "express";
import { config } from "../../config";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = config.jwtSecret;

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const token = req.cookies.authToken;
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    const userId = decoded.id;

    return {
      folder: "user-profile-pics",
      format: "png", // supports promises as well
      public_id: `${userId}` + "-" + Date.now(),
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
