import express from "express";
import { upload } from "./upload";
import cors from "cors";
import { uploadProfilePic } from "./uploadProfilePic";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: `http://localhost:3000`,
    credentials: true,
  })
);
router.use(cookieParser());
router.post("/upload-dp", upload.single("file"), uploadProfilePic);

export default router;
