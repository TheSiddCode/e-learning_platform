import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// ✅ Register User with OTP Verification
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  let user = await User.findOne({ email });
  if (user)
    return res.status(400).json({ message: "User Already Exists" });

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashPassword });

  // Generate 4-digit OTP
  const otp = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

  // Generate Activation Token
  const activationToken = jwt.sign(
    { user: { name: newUser.name, email: newUser.email, password: newUser.password }, otp },
    process.env.Activation_Secret,
    { expiresIn: "5m" }
  );

  // Send OTP via email
  await sendMail(email, "E-learning", { name, otp });

  res.status(200).json({ message: "OTP sent to your email", activationToken });
});

// ✅ Verify OTP and Register User
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);
  if (!verify)
    return res.status(400).json({ message: "OTP Expired" });

  if (verify.otp !== otp)
    return res.status(400).json({ message: "Wrong OTP" });

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  res.json({ message: "User Registered" });
});

// ✅ User Login
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "No User with this email" });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword)
    return res.status(401).json({ message: "Wrong Password" });

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, { expiresIn: "15d" });

  res.json({ message: `Welcome Back ${user.name}`, token, user });
});

// ✅ Get User Profile (Requires Auth Middleware)
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
});
