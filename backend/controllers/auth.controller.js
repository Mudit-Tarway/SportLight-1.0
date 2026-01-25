import User from "../models/user.js";
import Player from "../models/player.js";
import Club from "../models/club.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User exists" });

  let profile;
  if (role === "player") profile = await Player.create({});
  else profile = await Club.create({});

  const user = await User.create({
    name,
    email,
    password,
    role,
    profileId: profile._id,
  });

  res.status(201).json({ token: generateToken(user), role: user.role });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({ token: generateToken(user), role: user.role });
};
