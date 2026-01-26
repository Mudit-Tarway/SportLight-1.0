import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import playerRoutes from "./routes/player.routes.js";
import clubRoutes from "./routes/club.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/club", clubRoutes);

app.get("/", (req, res) => res.send("SportLight Backend Running!!"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
