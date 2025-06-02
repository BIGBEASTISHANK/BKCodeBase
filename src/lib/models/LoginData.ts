import mongoose from "mongoose";

interface ILoginData extends mongoose.Document {
  username: string;
  email: string;
  password: string;
}

const LoginDataSchema = new mongoose.Schema<ILoginData>(
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
  },
  { collection: "LoginData" }
);

export default mongoose.models.LoginData ||
  mongoose.model<ILoginData>("LoginData", LoginDataSchema);
