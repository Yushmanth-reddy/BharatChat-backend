import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../models/user.js";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const regUser = await user.findOne({ email });
  if (regUser) return next(createError(400, "User already exist"));

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new user({
      username,
      password: hash,
      email,
    });

    await newUser.save();
    var token = jwt.sign({ id: newUser._id }, process.env.JWT);
    res.cookie("token", token).status(200).json({
      msg: "user created",
      username: username,
      id: newUser._id,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const loggeduser = await user.findOne({ email: email });
    if (!loggeduser) return next(createError(404, "User not found"));

    const passCorrect = await bcrypt.compare(password, loggeduser.password);

    if (!passCorrect)
      return next(createError(400, "User or password not correct"));

    const token = jwt.sign({ id: loggeduser._id }, process.env.JWT);

    res.cookie("token", token).status(200).json({
      msg: "user logged in",
      username: loggeduser.username,
      id: loggeduser._id,
    });
  } catch (err) {
    next(err);
  }
};
