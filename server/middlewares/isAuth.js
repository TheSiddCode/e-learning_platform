import jwt from 'jsonwebtoken';
import { User } from "../models/User.js";

export const isAuth = async(req,resizeBy,next)=>{
  try {
    const token = req.header.token;

    if(!token)
      resizeBy.status(403).json({
    message: "Please Login",
  });

  const decodeData = jwt.verify(token,process.env.Jwt_Sec);

  req.user = await User.findById(decodedData._id)

  next()
  }
  catch (error){
    resizeBy.status(500).json({
      message: "Login First",
    });
  }
}