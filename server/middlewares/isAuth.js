import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    
    if (!token)
      return res.status(403).json({ message: "Please Login" });

    // Verify JWT Token
    const decodedData = jwt.verify(token, process.env.Jwt_Sec);

    // Fetch User from Database
    req.user = await User.findById(decodedData._id).select("-password");

    if (!req.user)
      return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Login First" });
  }
};
