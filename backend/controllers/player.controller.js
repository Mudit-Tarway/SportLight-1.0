import Player from "../models/player.js";

export const getMyProfile = async (req, res) => {
  try {
    const player = await Player.findById(req.user.profileId);
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.performanceData) {
      data.performanceData = JSON.parse(data.performanceData);
    }
    if (req.file) {
      data.achievementsImage = `/uploads/${req.file.filename}`;
    }
    if (
      data.name &&
      data.sport &&
      data.mobile &&
      data.age &&
      data.performanceData?.length > 0
    ) {
      data.profileCompleted = true;
    }

    const updated = await Player.findByIdAndUpdate(
      req.user.profileId,
      data,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      player: updated,
    });

  } catch (error) {
    console.error("UPDATE PLAYER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

import Player from "../models/player.js";
import User from "../models/user.js";

export const deleteMyProfile = async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.user.profileId);
    await User.findByIdAndDelete(req.user.userId);

    res.status(200).json({
      message: "Player profile and account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete player",
      error: error.message
    });
  }
};
