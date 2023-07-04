import user from "../models/user.js";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const veriftJWT = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    const { id } = jwt.verify(token, process.env.JWT);
    const loggeduser = await user.find({ _id: id });
    req.user = loggeduser;
    next();
  } catch (err) {
    return next(createError(400, "User not authenticated"));
  }
};
