import mongoose, { Schema } from "mongoose";

const messageSchema = Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Object,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamp: true }
);

export default mongoose.model("Messages", messageSchema);
