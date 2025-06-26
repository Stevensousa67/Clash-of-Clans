import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, href } = new URL(request.url);
  console.log("Callback URL:", href); // Debug
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to exchange code");
    }

    const { refresh_token } = data;
    console.log("Refresh Token:", refresh_token);

    return NextResponse.json({
      message: "Copy the refresh_token to your .env.local",
      refresh_token,
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Failed to get tokens" },
      { status: 500 }
    );
  }
}