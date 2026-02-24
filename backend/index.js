import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔥 PAKAI AUTH ROUTES
app.use("/auth", authRoutes);

// TEST
app.get("/", (req, res) => {
    res.send("Backend SC Pottery Store berjalan");
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});