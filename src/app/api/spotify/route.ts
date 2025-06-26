import { NextResponse } from "next/server";

// In-memory store for access token and expiration
let accessToken: string | null = null;
let tokenExpiration: number | null = null;

async function refreshAccessToken(): Promise<string> {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID!}:${process.env.SPOTIFY_CLIENT_SECRET!}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to refresh access token");
    }

    if (!data.access_token || typeof data.access_token !== "string") {
      throw new Error("Invalid access token received");
    }

    const token = data.access_token;
    accessToken = token;
    tokenExpiration = Date.now() + (data.expires_in - 300) * 1000;
    return token;
  } catch (error: unknown) {
    console.error("Token refresh error:", error);
    throw error;
  }
}

async function fetchPlaybackState(): Promise<Response> {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  return fetch(
    "https://api.spotify.com/v1/me/player?additional_types=track,episode",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

async function fetchCurrentlyPlaying(): Promise<Response> {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  return fetch(
    "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}

interface SpotifyPlaybackData {
  is_playing: boolean;
  item?: {
    type: string;
    name: string;
    artists?: Array<{ name: string }>;
    show?: { name: string };
  } | null;
  currently_playing_type?: string;
}

function processPlaybackData(playbackData: SpotifyPlaybackData) {
  const isListening = playbackData.is_playing;
  if (!isListening) {
    return {
      isListening: false,
      message: "Not listening - playback paused",
    };
  }

  // Check if we have item data
  if (playbackData.item) {
    const itemType = playbackData.item.type;
    const isTrack = itemType === "track";
    const isEpisode = itemType === "episode";

    if (!isTrack && !isEpisode) {
      return {
        isListening: false,
        message: `Unsupported media type: ${itemType}`,
      };
    }

    if (isEpisode) {
      const episodeName = playbackData.item.name || "Unknown Episode";
      const podcastName = playbackData.item.show?.name || "Unknown Podcast";

      return {
        isListening: true,
        trackName: episodeName,
        artistName: podcastName,
        itemType: "episode",
      };
    }

    // For tracks
    return {
      isListening,
      trackName: playbackData.item.name,
      artistName: playbackData.item.artists?.[0]?.name || "Unknown Artist",
      itemType: "track",
    };
  }

  // Handle case where item is null but we know the type
  if (playbackData.currently_playing_type) {
    if (playbackData.currently_playing_type === "episode") {
      return {
        isListening: true,
        trackName: "Unknown Episode",
        artistName: "Unknown Podcast",
        itemType: "episode",
      };
    }

    if (playbackData.currently_playing_type === "track") {
      return {
        isListening: true,
        trackName: "Unknown Track",
        artistName: "Unknown Artist",
        itemType: "track",
      };
    }
  }

  return {
    isListening: false,
    message: "Not listening - no content data",
  };
}

export async function GET() {
  try {
    // Check if token is missing or expired
    if (!accessToken || !tokenExpiration || Date.now() >= tokenExpiration) {
      await refreshAccessToken();
    }

    let playbackResponse = await fetchPlaybackState();

    // Handle no active device
    if (playbackResponse.status === 204) {
      return NextResponse.json({
        isListening: false,
        message: "Not listening",
      });
    }

    // Handle token expiration with retry
    if (playbackResponse.status === 401) {
      await refreshAccessToken();
      playbackResponse = await fetchPlaybackState();

      if (playbackResponse.status === 204) {
        return NextResponse.json({
          isListening: false,
          message: "Not listening",
        });
      }

      if (!playbackResponse.ok) {
        throw new Error("Failed to fetch playback state after token refresh");
      }
    } else if (!playbackResponse.ok) {
      throw new Error(`Spotify API error: ${playbackResponse.status}`);
    }

    let playbackData = await playbackResponse.json();

    // If item is null but we're playing something, try the currently-playing endpoint
    if (playbackData.is_playing && !playbackData.item) {
      try {
        const currentlyPlayingResponse = await fetchCurrentlyPlaying();
        if (currentlyPlayingResponse.ok) {
          const currentlyPlayingData = await currentlyPlayingResponse.json();
          if (currentlyPlayingData.item) {
            playbackData = currentlyPlayingData;
          }
        }
      } catch {
        // Continue with original data if currently-playing fails
      }
    }

    const result = processPlaybackData(playbackData);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Spotify API error:", error);
    return NextResponse.json(
      { isListening: false, message: "Error fetching Spotify data" },
      { status: 500 }
    );
  }
}
