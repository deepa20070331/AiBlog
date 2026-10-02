import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/posts", postRoutes);
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Something went wrong on the server." });
});

try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-blognest");
  app.listen(port, () => console.log(`Blognest API listening on http://localhost:${port}`));
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}