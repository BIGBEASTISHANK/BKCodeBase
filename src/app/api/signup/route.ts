import dbConnect from "@/lib/db/mongoose";
import LoginData from "@/lib/models/LoginData";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // Storing return response.
  let returnResponse;

  try {
    // Connect to database
    await dbConnect();

    // Getting data from the request
    const requestData = await request.json();
    const { username, email, password } = requestData;

    // Making sure every field is filled
    if (!username || !email || !password) {
      returnResponse = NextResponse.json(
        { error: "Every field is required!" },
        { status: 400 }
      );
      return returnResponse;
    }

    // If username or email already exist
    const usernameExist = await LoginData.findOne({ username });
    const emailExist = await LoginData.findOne({ email });

    if (usernameExist) {
      returnResponse = NextResponse.json(
        { error: "Username already exist in system!" },
        { status: 400 }
      );
      return returnResponse;
    } else if (emailExist) {
      returnResponse = NextResponse.json(
        { error: "Email already exist in system!" },
        { status: 400 }
      );
      return returnResponse;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Saving userdata
      const saveData = new LoginData({
        username,
        email,
        password: hashedPassword,
      });

      saveData.save();

      returnResponse = NextResponse.json(
        { success: "Login saved succesfully!" },
        { status: 200 }
      );
      return returnResponse;
    }
  } catch (err) {
    returnResponse = NextResponse.json(
      { error: "Unknown Error: " + err },
      { status: 500 }
    );
    return returnResponse;
  }
}
