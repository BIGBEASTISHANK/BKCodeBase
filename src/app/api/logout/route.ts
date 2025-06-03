import { NextResponse } from "next/server";

export async function GET() {
  try {
    const returnResponse = await NextResponse.json(
      { message: "Logout Succsefully" },
      { status: 200 }
    );

    returnResponse.cookies.set("token", "", {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(0),
    });

    return returnResponse;
  } catch (err) {
    return NextResponse.json({ message: "Unable to logout!" }, { status: 500 });
  }
}
