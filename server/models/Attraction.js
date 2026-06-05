import mongoose from "mongoose";

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    sourceUrl: {
      type: String,
      required: true,
      trim: true,
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

    source: {
      type: String,
      enum: ["manual", "ai"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

const Attraction = mongoose.model("Attraction", attractionSchema);

export default Attraction;