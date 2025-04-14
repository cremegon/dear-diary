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

// ---------------------- Check Chapter
app.get("/check-chapter", checkChapter);

// ---------------------- Save Content
app.post("/save-to-db", saveContent);

// ---------------------- Load Content
app.post("/load-from-db", loadContent);

// ---------------------- Save Cover Art
app.post("/save-cover-art/:diaryId", saveCoverArt);

// ---------------------- Load Cover Art
app.get("/load-cover-art/:diaryURL", loadCoverArt);

//Server Listen
const PORT = config.serverPort;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
