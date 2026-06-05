import express from "express";
import Attraction from "../models/Attraction.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// Search attractions by city, age and participants
router.get("/", async (req, res) => {
  try {
    const { city, age, participants } = req.query;

    if (!city || age === undefined || participants === undefined) {
      return res.status(400).json({
        error: "Missing required search parameters",
      });
    }

    const childAge = Number(age);
    const numberOfParticipants = Number(participants);

    if (Number.isNaN(childAge) || childAge < 0 || childAge > 18) {
      return res.status(400).json({
        error: "Invalid age",
      });
    }

    if (
      Number.isNaN(numberOfParticipants) ||
      numberOfParticipants < 1
    ) {
      return res.status(400).json({
        error: "Invalid number of participants",
      });
    }

    const attractions = await Attraction.find({
      city: { $regex: city, $options: "i" },
      minAge: { $lte: childAge },
      maxAge: { $gte: childAge },
    });

    const matchingAttractions = [];

    for (const attraction of attractions) {
      const activities = await Activity.find({
        attractionId: attraction._id,
        minAge: { $lte: childAge },
        maxAge: { $gte: childAge },
        maxParticipants: { $gte: numberOfParticipants },
      });

      if (activities.length > 0) {
        matchingAttractions.push({
          ...attraction.toObject(),
          activitiesCount: activities.length,
        });
      }
    }

    res.json(matchingAttractions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;