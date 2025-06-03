import dbConnect from "@/lib/db/mongoose";
import UserData from "@/lib/models/UserData";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  // Return response variable
  let returnResponse;
  let statusCode = 500;
  let message = "Unknown";

  try {
    // Connect to database
    await dbConnect();

    // Checking for proper JWT_SECRET
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
      throw new Error("JWT_SECRET must be at least 32 characters long");

    // Getting request data
    const requestData = await request.json();
    const { username_email, password } = requestData;

    // Making sure all fields are perfect
    if (
      !password ||
      !username_email ||
      password.length > 128 ||
      username_email.length > 254
    ) {
      statusCode = 400;
      message = "Fields missing";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Removing whitespace from email/username and password
    const trimmedUsername_Email = username_email.trim();
    const trimmedPassword = password.trim();

    // Getting user data from db
    const userDBData = await UserData.findOne({
      $or: [
        { username: trimmedUsername_Email },
        { email: trimmedUsername_Email },
      ],
    });

    // Checking if user exist
    if (!userDBData) {
      statusCode = 401;
      message = "Invalid credentials";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Validating user password
    const isValidPass = await bcrypt.compare(
      trimmedPassword,
      userDBData.password
    );

    if (isValidPass) {
      statusCode = 200;
      message = "Password correct & validated";

      // Return response
      returnResponse = NextResponse.json(
        { success: message },
        { status: statusCode }
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
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      // Returning response
      return returnResponse;
    } else {
      statusCode = 401;
      message = "Invalid credentials";
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  } catch (err) {
    // Login and returning server error
    console.error("Login error:", err);
    statusCode = 500;
    message = "Internal server error";
    returnResponse = NextResponse.json(
      { error: message },
      { status: statusCode }
    );
    return returnResponse;
  } finally {
    console.log("Status Returned: " + statusCode);
    console.log("Message Returned: " + message);
  }
}
