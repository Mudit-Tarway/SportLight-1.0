import Club from "../models/club.js";

export const getMyClub = async (req, res) => {
  const club = await Club.findById(req.user.profileId);
  res.json(club);
};

export const updateClub = async (req, res) => {
  const data = { ...req.body };

  if (req.files) {
    if (req.files.logo) data.logo = `/uploads/${req.files.logo[0].filename}`;
    if (req.files.affiliation) data.affiliation = `/uploads/${req.files.affiliation[0].filename}`;
  }

  const updated = await Club.findByIdAndUpdate(req.user.profileId, data, { new: true });
  res.json(updated);
};
