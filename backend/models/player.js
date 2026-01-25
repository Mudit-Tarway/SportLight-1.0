import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  metric: String,
  value: Number,
  unit: String,
});

const playerSchema = new mongoose.Schema({
    name: String,
    sport: String,
    age: Number,
    gender: String,
    location: String,
    mobile: String,
    height: Number,
    weight: Number,
    dreamClub: { type: String, default: "" },
    skills: [String],
    achievementsText: String,
    achievementsImage: String,
    performanceData: [performanceSchema],
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const Player = mongoose.models.Player || mongoose.model("Player", playerSchema);

export default Player;
