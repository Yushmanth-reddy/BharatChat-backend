import user from "../models/user.js";

export const getallusers = async (req, res, next) => {
  try {
    const users = await user
      .find({ _id: { $ne: req.params.id } })
      .select(["email", "username", "_id"]);
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
