import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    if (!username || !password || !fullName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const user = await User.create({
      username,
      password,
      fullName,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;