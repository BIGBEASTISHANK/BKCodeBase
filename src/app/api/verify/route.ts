import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/mongoose";
import UserData from "@/lib/models/UserData";

export async function GET(request: NextRequest) {
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

    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      statusCode = 401;
      message = "Authentication required";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // Find user by ID from token
    const user = await UserData.findById(decoded.id).select("-password");
    console.log(user);

    if (!user) {
      statusCode = 404;
      message = "User not found";
      returnResponse = NextResponse.json(
        { error: message },
        { status: statusCode }
      );
      return returnResponse;
    }

    // Return user data (excluding password)
    statusCode = 200;
    message = "User verified successfully";
    returnResponse = NextResponse.json(
      {
        success: message,
        user: {
          username: user.username,
          email: user.email,
          level: user.level,
          knowledgeLevel: user.knowledgeLevel,
          badges: user.badges,
        },
      },
      { status: statusCode }
    );

    return returnResponse;
  } catch (error) {
    // Log error for debugging
    console.error("Verify error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      statusCode = 401;
      message = "Invalid token";
    } else if (error instanceof jwt.TokenExpiredError) {
      statusCode = 401;
      message = "Token expired";
    } else {
      statusCode = 500;
      message = "Internal server error";
    }

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
