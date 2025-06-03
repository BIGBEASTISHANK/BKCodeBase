import { NextResponse } from "next/server";

export async function POST() {
  // Return response variable
  let returnResponse;
  let statusCode = 200;
  let message = "Logout successful";

  try {
    // Create success response
    returnResponse = NextResponse.json(
      { success: message },
      { status: statusCode }
    );

    // Delete the token cookie
    returnResponse.cookies.set("token", "", {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return returnResponse;
  } catch (err) {
    // Log error and return server error response
    console.error("Logout error:", err);
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
