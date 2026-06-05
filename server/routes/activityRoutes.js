import express from "express";
import Activity from "../models/Activity.js";
import Attraction from "../models/Attraction.js";

const router = express.Router();

// Create new activity
router.post("/", async (req, res) => {
  try {
    const {
      name,
      attractionId,
      minAge,
      maxAge,
      maxParticipants,
      pricePerParticipant,
      durationMinutes,
    } = req.body;

    if (
      !name ||
      !attractionId ||
      minAge === undefined ||
      maxAge === undefined ||
      maxParticipants === undefined ||
      pricePerParticipant === undefined ||
      durationMinutes === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const attraction = await Attraction.findById(attractionId);

    if (!attraction) {
      return res.status(404).json({ error: "Attraction not found" });
    }

    if (minAge < 0 || maxAge > 18 || minAge > maxAge) {
      return res.status(400).json({ error: "Invalid age range" });
    }

    if (maxParticipants < 1) {
      return res.status(400).json({ error: "maxParticipants must be at least 1" });
    }

    if (pricePerParticipant < 0) {
      return res.status(400).json({ error: "pricePerParticipant cannot be negative" });
    }

    if (durationMinutes < 1) {
      return res.status(400).json({ error: "durationMinutes must be at least 1" });
    }

    const activity = await Activity.create({
      name,
      attractionId,
      minAge,
      maxAge,
      maxParticipants,
      pricePerParticipant,
      durationMinutes,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get activity by id
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate("attractionId");

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    res.status(400).json({ error: "Invalid activity id" });
  }
});

export default router;