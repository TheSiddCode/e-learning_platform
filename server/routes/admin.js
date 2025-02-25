import express from "express";
const router = express.Router();

// Example admin route
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin Dashboard" });
});

export default router;  // ✅ Ensure this is present
