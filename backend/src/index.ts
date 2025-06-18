import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "./config";

import { signUpCodeSend } from "./controllers/auth/authSignupCode";
import { confirmSignupCode } from "./controllers/auth/confirmSignupCode";
import { validateToken } from "./middleware/validateToken";
import { signupUser } from "./controllers/auth/authSignup";
import { loginUser } from "./controllers/auth/authLogin";
import { logoutUser } from "./controllers/auth/authLogout";

import { createDiary } from "./controllers/diaries/createDiary";
import { createChapter } from "./controllers/chapters/createChapter";
import { checkDiary } from "./controllers/diaries/checkDiary";

import { saveContent } from "./controllers/diaries/saveContent";
import { loadContent } from "./controllers/diaries/loadContent";
import { saveCoverArt } from "./controllers/cover-art/saveCoverArt";
import { loadCoverArt } from "./controllers/cover-art/loadCoverArt";

import { deleteDiary } from "./controllers/diaries/deleteDiary";
import { deleteChapter } from "./controllers/chapters/deleteChapter";

import { addEntrustee } from "./controllers/entrustees/addEntrustee";
import { fetchArchives } from "./controllers/archives/fetchArchives";
import { fetchTrustees } from "./controllers/entrustees/fetchTrustees";
import { fetchDiary } from "./controllers/diaries/fetchDiary";
import { fetchChapters } from "./controllers/chapters/fetchChapter";

import { compileDiary } from "./controllers/diaries/compileDiary";

import { forgotPassword } from "./controllers/auth/authForgotPass";
import { confirmForgotPassword } from "./controllers/auth/confirmForgotPass";
import { resetPassword } from "./controllers/auth/resetPassword";
import {
  cycleToNextChapter,
  cycleToPrevChapter,
} from "./controllers/chapters/cycleChapter";
import { fetchUniqueTrustees } from "./controllers/entrustees/fetchUniqueTrustees";
import { authMiddleware } from "./middleware/authMiddleware";
import { expireCookieTest } from "./utils/expireCookieTest";
import { changeTitle } from "./controllers/diaries/changeTitle";
import { fetchNextPrevChapters } from "./controllers/chapters/nextPrevChapter";
import { fetchBio } from "./controllers/profile/fetchBio";
import { updateBio } from "./controllers/profile/updateBio";
import { uploadProfilePic } from "./controllers/profile/uploadProfilePic";

import { Request, Response } from "express";
import { Pool } from "pg";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
const JWT_SECRET = config.jwtSecret;

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: "user-profile-pics",
      format: "png", // supports promises as well
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const app = express();

app.use(express.Router());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: `http://localhost:3000`,
    credentials: true,
  })
);

app.get("/expire-cookie", expireCookieTest);

// ---------------------- Sign Up new Users
app.post("/signup", signupUser);

// ---------------------- Send SignUp Code
app.post("/send-signup-code", signUpCodeSend);

// ---------------------- Confirm SignUp Code
app.post("/verify-signup-code", confirmSignupCode);

// ---------------------- Verify new/existing Users
app.get("/verify", validateToken);

// ---------------------- Login existing Users
app.post("/login", loginUser);

// ---------------------- Logout existing Users
app.get("/logout", logoutUser);

// ---------------------- Create Diary
app.post("/new-diary", authMiddleware, createDiary);

// ---------------------- Delete Diary
app.delete("/delete-diary/:diaryURL", authMiddleware, deleteDiary);

// ---------------------- Create Chapter
app.post("/new-chapter", authMiddleware, createChapter);

// ---------------------- Cycle Between Chapter Pages
app.get("/prev-chapter/:chapterURL", cycleToPrevChapter);
app.get("/next-chapter/:chapterURL", cycleToNextChapter);

// ---------------------- Delete Chapter
app.delete("/delete-chapter/:chapterURL", authMiddleware, deleteChapter);

// ---------------------- Check Diary
app.get("/check-diary", authMiddleware, checkDiary);

app.post("/change-diary-title/:diaryURL", authMiddleware, changeTitle);

// ---------------------- Fetch a Diary
app.get("/fetch-diary/:diaryURL", authMiddleware, fetchDiary);

// ---------------------- Check Chapter
app.get("/check-chapter", authMiddleware, fetchChapters);

// ---------------------- Get the Prev+Next ChapterId's
app.get("/fetch-next-prev-chapters/:chapterURL", fetchNextPrevChapters);

// ---------------------- Check Archives
app.get("/check-archives", authMiddleware, fetchArchives);

// ---------------------- Save Content
app.post("/save-to-db", saveContent);

// ---------------------- Load Content
app.post("/load-from-db", authMiddleware, loadContent);

// ---------------------- Save Cover Art
app.post("/save-cover-art/:diaryURL", saveCoverArt);

// ---------------------- Load Cover Art
app.get("/load-cover-art/:diaryURL", loadCoverArt);

// ---------------------- Compile Diary to PDF
app.post("/finish-diary/:diaryURL", authMiddleware, compileDiary);

// ---------------------- Send Reset Password
app.post("/forgot-password", forgotPassword);

// ---------------------- Check Reset Code
app.post("/check-reset-code", confirmForgotPassword);

// ---------------------- Check Reset Code
app.post("/reset-password", resetPassword);

// ---------------------- Fetch All Unique Trustees
app.get("/fetch-unique-trustees", authMiddleware, fetchUniqueTrustees);

// ---------------------- Fetch All Linked Trustees
app.get("/fetch-trustees", authMiddleware, fetchTrustees);

// ---------------------- Add New Entrustee
app.post("/add-entrustee/:diaryURL", authMiddleware, addEntrustee);

// ---------------------- Fetch Profile Details
app.get("/fetch-bio", authMiddleware, fetchBio);

// ---------------------- Update Profile Details
app.post("/update-bio", authMiddleware, updateBio);

// ---------------------- Upload Profile Pic
app.post("/upload", upload.single("image"), function (req, res) {
  console.log(req.file);
  res.send("File Uploaded Successfully");
});
//Server Listen
const PORT = config.serverPort;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
