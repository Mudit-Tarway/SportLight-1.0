import Player from "../models/player.js";

export const getMyProfile = async (req, res) => {
  const player = await Player.findById(req.user.profileId);
  res.json(player);
};

export const updatePlayer = async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.achievementsImage = `/uploads/${req.file.filename}`;
  const updated = await Player.findByIdAndUpdate(req.user.profileId, data, { new: true });
  res.json(updated);
};
