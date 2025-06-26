'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotifyStatus {
  isListening: boolean;
  trackName?: string;
  artistName?: string;
  message?: string;
  itemType?: string;
}

export default function SpotifyStatus() {
  const [status, setStatus] = useState<SpotifyStatus>({ isListening: false });

  useEffect(() => {
    async function fetchSpotifyStatus() {
      try {
        const response = await fetch('api/spotify');
        const data: SpotifyStatus = await response.json();
        setStatus(data);
      } catch {
        setStatus({ isListening: false, message: 'Error fetching Spotify data' });
      }
    }
    fetchSpotifyStatus();
    const interval = setInterval(fetchSpotifyStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNowPlaying = () => {
    if (!status.isListening) {
      return status.message || 'Not listening to Spotify';
    }

    if (status.itemType === 'episode') {
      return `Now Playing: ${status.trackName} from ${status.artistName}`;
    } else {
      return `Now Playing: ${status.trackName} by ${status.artistName}`;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.p key={`${status.isListening}-${status.trackName}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="">
          {formatNowPlaying()}
        </motion.p>
      </AnimatePresence>
    </>
  );
}