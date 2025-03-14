import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { signupUser } from "./controllers/authSignup";
import { loginUser } from "./controllers/authLogin";
import { validateToken } from "./middleware/validateToken";
import { logoutUser } from "./controllers/authLogout";
import { createDiary } from "./controllers/createDiary";

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

//Server Listen
const PORT = config.serverPort;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
