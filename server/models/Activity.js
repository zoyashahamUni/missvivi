import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    attractionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attraction",
      required: true,
    },

    minAge: {
      type: Number,
      required: true,
      min: 0,
      max: 18,
    },

    maxAge: {
      type: Number,
      required: true,
      min: 0,
      max: 18,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerParticipant: {
      type: Number,
      required: true,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;