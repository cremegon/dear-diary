import express from "express";
import { upload } from "./upload";
import cors from "cors";
import { uploadManualDiary } from "./uploadManualDiary";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());
router.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: `http://localhost:3000`,
    credentials: true,
  })
);
router.use(cookieParser());
router.post(
  "/upload-manual-diary/:title",
  upload.single("file"),
  uploadManualDiary
);

export default router;
