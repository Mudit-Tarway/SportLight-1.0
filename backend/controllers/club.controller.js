import Club from "../models/club.js";

// Get all clubs (public)
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in club profile
export const getMyClub = async (req, res) => {
  try {
    const club = await Club.findById(req.user.profileId);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update club profile
export const updateClub = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.logo) {
        data.logo = `/uploads/${req.files.logo[0].filename}`;
      }
      if (req.files.affiliation) {
        data.affiliation = `/uploads/${req.files.affiliation[0].filename}`;
      }
    }

    const existingClub = await Club.findById(req.user.profileId);
    if (!existingClub) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Profile completion logic
    const isProfileCompleted =
      (data.name || existingClub.name) &&
      (data.address || existingClub.address) &&
      (data.contactPerson || existingClub.contactPerson) &&
      (data.contactMobile || existingClub.contactMobile) &&
      (data.contactEmail || existingClub.contactEmail);

    data.profileCompleted = Boolean(isProfileCompleted);

    const updatedClub = await Club.findByIdAndUpdate(
      req.user.profileId,
      data,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Club profile updated successfully",
      club: updatedClub,
    });

  } catch (error) {
    console.error("UPDATE CLUB ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
