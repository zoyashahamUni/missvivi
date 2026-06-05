import express from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Attraction from "../models/Attraction.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// Create new booking
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      attractionId,
      activityId,
      customerName,
      visitDate,
      participants,
      childAge,
    } = req.body;

    // 1. Required fields
    if (
      !userId ||
      !attractionId ||
      !activityId ||
      !customerName ||
      !visitDate ||
      participants === undefined ||
      childAge === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Find attraction
    const attraction = await Attraction.findById(attractionId);
    if (!attraction) {
      return res.status(404).json({ error: "Attraction not found" });
    }

    // 4. Find activity
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // 5. Check activity belongs to attraction
    if (activity.attractionId.toString() !== attractionId) {
      return res.status(400).json({
        error: "Activity does not belong to the selected attraction",
      });
    }

    // 6. Validate date
    const selectedDate = new Date(visitDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({ error: "Invalid visit date" });
    }

    if (selectedDate < today) {
      return res.status(400).json({ error: "Visit date must be in the future" });
    }

    // 7. Validate participants
    if (participants < 1) {
      return res.status(400).json({ error: "Participants must be at least 1" });
    }

    // 8. Validate child age
    if (childAge < activity.minAge || childAge > activity.maxAge) {
      return res.status(400).json({
        error: "Child age is not suitable for this activity",
      });
    }

    // 9. Check existing bookings for the same activity and date
    const existingBookings = await Booking.find({
      activityId,
      visitDate: selectedDate,
    });

    const alreadyBookedParticipants = existingBookings.reduce(
      (sum, booking) => sum + booking.participants,
      0
    );

    const availableSpots =
      activity.maxParticipants - alreadyBookedParticipants;

    if (participants > availableSpots) {
      return res.status(409).json({
        error: "No available spots for this date",
      });
    }

    // 10. Calculate total price with VAT
    const totalPrice = participants * activity.pricePerParticipant * 1.18;

    // 11. Create booking
    const booking = await Booking.create({
      userId,
      attractionId,
      activityId,
      customerName,
      visitDate: selectedDate,
      participants,
      childAge,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username fullName")
      .populate("attractionId", "name city type")
      .populate("activityId", "name pricePerParticipant");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;