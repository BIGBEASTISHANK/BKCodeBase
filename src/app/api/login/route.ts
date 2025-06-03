import dbConnect from "@/lib/db/mongoose";
import UserData from "@/lib/models/UserData";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  // Return response variable
  let returnResponse;

  try {
    // Connect to database
    await dbConnect();

    // Getting request data
    const requestData = await request.json();
    const { username_email, password } = requestData;

    // Making sure all fields are perfect
    if (!password || !username_email) {
      returnResponse = NextResponse.json(
        { error: "Fields missing!" },
        { status: 400 }
      );
      return returnResponse;
    }

    // Getting user data from db
    const userDBData = await UserData.findOne({
      $or: [{ username: username_email }, { email: username_email }],
    });

    // Checking if user exist
    if (!userDBData) {
      returnResponse = NextResponse.json(
        { error: "Username not found" },
        { status: 400 }
      );
      return returnResponse;
    }

    // Validating user password
    const isValidPass = await bcrypt.compare(password, userDBData.password);

    if (isValidPass) {
      // Return response
      returnResponse = NextResponse.json(
        { error: "No error" },
        { status: 200 }
      );

      // Storing login info in cookie
      const token = jwt.sign(
        {
          id: userDBData._id.toString(),
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      // Set HTTP-only cookie
      returnResponse.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Returning response
      return returnResponse;
    } else
      return NextResponse.json({ error: "Invalid password" }, { status: 200 });
  } catch (err) {
    returnResponse = NextResponse.json(
      { error: "Unknown Error: " + err },
      { status: 500 }
    );
    return returnResponse;
  }
}
