import express from "express";
import { upload } from "./upload";
import cors from "cors";
import { uploadProfilePic } from "./uploadProfilePic";

const router = express.Router();
router.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: `http://localhost:3000`,
    credentials: true,
  })
);
router.post("/upload-dp", upload.single("file"), uploadProfilePic);

export default router;
