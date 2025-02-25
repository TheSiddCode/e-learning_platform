import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./database/db.js";

// Import Routes at the Top (Fixes Import Error)
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS

// Use Routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Connect to Database and Start Server
connectDb()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`✅ Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1); // Stop the server if DB connection fails
  });
