import express from "express";
import Attraction from "../models/Attraction.js";
import Activity from "../models/Activity.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// Create new attraction
router.post("/", async (req, res) => {
  try {
    const { name, city, type, description, minAge, maxAge, source } = req.body;

    if (!name || !city || !type || minAge === undefined || maxAge === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (minAge < 0 || maxAge > 18 || minAge > maxAge) {
      return res.status(400).json({ error: "Invalid age range" });
    }

    const attraction = await Attraction.create({
      name,
      city,
      type,
      description,
      minAge,
      maxAge,
      source: source || "manual",
    });

    res.status(201).json(attraction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all attractions
router.get("/", async (req, res) => {
  try {
    const attractions = await Attraction.find();
    res.json(attractions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all activities of a specific attraction
router.get("/:id/activities", async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);

    if (!attraction) {
      return res.status(404).json({ error: "Attraction not found" });
    }

    const activities = await Activity.find({
      attractionId: req.params.id,
    });

    res.json(activities);
  } catch (error) {
    res.status(400).json({ error: "Invalid attraction id" });
  }
});

// Get attraction by id
router.get("/:id", async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);

    if (!attraction) {
      return res.status(404).json({ error: "Attraction not found" });
    }

    res.json(attraction);
  } catch (error) {
    res.status(400).json({ error: "Invalid attraction id" });
  }
});

// TEMP: delete all attraction-related data
router.delete("/delete-all", async (req, res) => {
  try {
    const deletedBookings = await Booking.deleteMany({});
    const deletedActivities = await Activity.deleteMany({});
    const deletedAttractions = await Attraction.deleteMany({});

    res.json({
      message: "All attractions, activities and bookings deleted",
      deleted: {
        bookings: deletedBookings.deletedCount,
        activities: deletedActivities.deletedCount,
        attractions: deletedAttractions.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;