import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    foundationDate: String,
    createdAt: String,
    contactPerson: String,
    contactMobile: String,
    contactEmail: String,
    logo: String,
    affiliation: String,
    profileCompleted: { type: Boolean, default: false }, // new
  },
  { timestamps: true }
);
const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);
export default Club;
