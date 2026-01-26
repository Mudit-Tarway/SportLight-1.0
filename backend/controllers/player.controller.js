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

    // Parse performanceData JSON string
    if (data.performanceData) {
      data.performanceData = JSON.parse(data.performanceData);
    }

    // Handle achievement image
    if (req.file) {
      data.achievementsImage = `/uploads/${req.file.filename}`;
    }

    // Check profile completion
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
