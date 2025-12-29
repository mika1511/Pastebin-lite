import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.js";
import pasteRoutes from "./routes/pastes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/", pasteRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
