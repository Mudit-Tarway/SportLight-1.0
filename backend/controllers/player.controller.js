import Player from "../models/player.js";
import User from "../models/user.js";

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const player = await Player.findById(req.user.profileId);

    if (!player) {
      return res.status(404).json({ message: "Player profile not found" });
    }

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
    const existingPlayer = await Player.findById(req.user.profileId);

    if (!existingPlayer) {
      return res.status(404).json({ message: "Player profile not found" });
    }
    const isProfileCompleted =
      (data.name || existingPlayer.name) &&
      (data.sport || existingPlayer.sport) &&
      (data.mobile || existingPlayer.mobile) &&
      (data.age || existingPlayer.age) &&
      ((data.performanceData || existingPlayer.performanceData)?.length > 0);

    data.profileCompleted = isProfileCompleted;

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

export const deleteMyProfile = async (req, res) => {
  try {
    const player = await Player.findById(req.user.profileId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    await Player.findByIdAndDelete(req.user.profileId);

    // Delete user account
    await User.findByIdAndDelete(req.user.userId);

    res.status(200).json({
      message: "Player profile and account deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete player",
      error: error.message,
    });
  }
};
