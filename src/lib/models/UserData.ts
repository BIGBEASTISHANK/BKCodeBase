import mongoose from "mongoose";

interface IUserData extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  level: number;
  knowledgeLevel?: string[];
  badges?: string[];
}

const UserDataSchema = new mongoose.Schema<IUserData>(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    level: {
      type: Number,
      default: 1,
    },
    knowledgeLevel: {
      type: [String],
      default: [],
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  { collection: "UserData" }
);

export default mongoose.models.UserData ||
  mongoose.model<IUserData>("UserData", UserDataSchema);
