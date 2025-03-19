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

// ---------------------- Create Chapter
app.post("/new-chapter", createChapter);

// ---------------------- Check Diary
app.get("/check-diary", checkDiary);

// ---------------------- Check Diary
app.get("/check-chapter", checkChapter);

// ---------------------- Save Content
app.post("/save-to-db", saveContent);

// ---------------------- Load Content
app.post("/load-from-db", loadContent);

//Server Listen
const PORT = config.serverPort;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
