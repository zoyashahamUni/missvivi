import express from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

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

    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
      },
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

    const token = createToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current logged-in user from token
router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
});
export default router;