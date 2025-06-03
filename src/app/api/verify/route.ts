import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db/mongoose";
import UserData from "@/lib/models/UserData";

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No token found" },
        { status: 401 }
      );
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // Find user by ID from token
    const user = await UserData.findById(decoded.id).select("-password");

    console.log(user)

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data (excluding password)
    return NextResponse.json({
      username: user.username,
      email: user.email,
      knowledgeLevel: user.knowledgeLevel,
      badges: user.badges,
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Server error: " + error },
      { status: 500 }
    );
  }
}
