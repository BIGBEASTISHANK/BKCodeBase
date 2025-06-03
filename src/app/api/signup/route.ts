import dbConnect from "@/lib/db/mongoose";
import UserData from "@/lib/models/UserData";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // Return response variable
  let returnResponse;
  let statusCode = 500;
  let message = "Unknown";

  try {
    // Connect to database
    await dbConnect();

    // Getting data from the request
    const requestData = await request.json();
    const { username, email, password } = requestData;

    // Input validation with length limits
    if (
      !username ||
      !email ||
      !password ||
      username.length > 50 ||
      email.length > 254 ||
      password.length > 128
    ) {
      statusCode = 400;
      message = "Invalid input fields";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Removing whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      statusCode = 400;
      message = "Invalid email format";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Password strength validation
    if (trimmedPassword.length < 8) {
      statusCode = 400;
      message = "Password must be at least 8 characters long";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Check if username or email already exist
    const existingUser = await UserData.findOne({
      $or: [{ username: trimmedUsername }, { email: trimmedEmail }],
    });

    if (existingUser) {
      statusCode = 409;
      message = "Username or email already exists";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 12);

    // Save user data
    const saveData = new UserData({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
    });

    await saveData.save();

    statusCode = 201;
    message = "Account created successfully";
    returnResponse = NextResponse.json(
      { success: message },
      { status: statusCode }
    );
    return returnResponse;
  } catch (err) {
    // Log error and return server error response
    console.error("Signup error:", err);
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
