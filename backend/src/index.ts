import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { signupUser } from "./controllers/authSignup";
import { loginUser } from "./controllers/authLogin";
import { validateToken } from "./middleware/validateToken";
import { logoutUser } from "./controllers/authLogout";
import { createDiary } from "./controllers/createDiary";
import { createChapter } from "./controllers/createChapter";
import { checkDiary } from "./controllers/checkDiary";
import { checkChapter } from "./controllers/checkChapter";
import { saveContent } from "./controllers/saveContent";
import { loadContent } from "./controllers/loadContent";
import { deleteDiary } from "./controllers/deleteDiary";
import { deleteChapter } from "./controllers/deleteChapter";
import { saveCoverArt } from "./controllers/saveCoverArt";
import { loadCoverArt } from "./controllers/loadCoverArt";
import { compileDiary } from "./controllers/compileDiary";
import { send_PDF_Email } from "./middleware/sendEmail";
import { checkArchives } from "./controllers/checkArchives";
import { fetchDiary } from "./controllers/fetchDiary";
import { forgotPassword } from "./controllers/authForgotPass";
import { confirmForgotPassword } from "./controllers/confirmForgotPass";
import { resetPassword } from "./controllers/resetPassword";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: `http://localhost:3000`,
    credentials: true,
  })
);
// ---------------------- Sign Up new Users
app.post("/signup", signupUser);

// ---------------------- Verify new/existing Users
app.get("/verify", validateToken);

// ---------------------- Login existing Users
app.post("/login", loginUser);

// ---------------------- Logout existing Users
app.get("/logout", logoutUser);

// ---------------------- Create Diary
app.post("/new-diary", createDiary);

// ---------------------- Delete Diary
app.delete("/delete-diary/:diaryURL", deleteDiary);

// ---------------------- Create Chapter
app.post("/new-chapter", createChapter);

// ---------------------- Delete Chapter
app.delete("/delete-chapter/:chapterURL", deleteChapter);

// ---------------------- Check Diary
app.get("/check-diary", checkDiary);

// ---------------------- Fetch a Diary
app.get("/fetch-diary/:diaryURL", fetchDiary);

// ---------------------- Check Chapter
app.get("/check-chapter", checkChapter);

// ---------------------- Check Archives
app.get("/check-archives", checkArchives);

// ---------------------- Save Content
app.post("/save-to-db", saveContent);

// ---------------------- Load Content
app.post("/load-from-db", loadContent);

// ---------------------- Save Cover Art
app.post("/save-cover-art/:diaryURL", saveCoverArt);

// ---------------------- Load Cover Art
app.get("/load-cover-art/:diaryURL", loadCoverArt);

// ---------------------- Compile Diary to PDF
app.post("/finish-diary/:diaryURL", compileDiary);

// ---------------------- Send Reset Password
app.post("/forgot-password", forgotPassword);

// ---------------------- Check Reset Code
app.post("/check-reset-code", confirmForgotPassword);

// ---------------------- Check Reset Code
app.post("/reset-password", resetPassword);

//Server Listen
const PORT = config.serverPort;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
