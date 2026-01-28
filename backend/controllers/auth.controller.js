import User from "../models/user.js";
import Player from "../models/player.js";
import Club from "../models/club.js";
import generateToken from "../utils/generateToken.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["player", "club"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create empty profile based on role
    let profile;
    if (role === "player") {
      profile = await Player.create({});
    } else {
      profile = await Club.create({});
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      profileId: profile._id,
    });

    res.status(201).json({
      message: "Signup successful",
      token: generateToken(user),
      role: user.role,
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      role: user.role,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
