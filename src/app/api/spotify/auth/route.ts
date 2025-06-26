import { NextResponse } from 'next/server';

export async function GET() {
    // Redirect to Spotify authorization URL
    const authURL = new URL('https://accounts.spotify.com/authorize');
    authURL.searchParams.append('client_id', process.env.SPOTIFY_CLIENT_ID!);
    authURL.searchParams.append('response_type', 'code');
    authURL.searchParams.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI!);
    authURL.searchParams.append('scope', 'user-read-currently-playing user-read-playback-state');

    console.log("Authorization URL:", authURL.toString());
    return NextResponse.redirect(authURL);
}