import React from 'react';
import Image from "next/image";
import SpotifyStatus from './SpotifyStatus';
import SocialMediaLinks from './SocialMediaLinks';
import Copyright from './Copyright';

export default function Footer() {
  const baseUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}svgs/`;

  return (
    <footer className="relative max-w-5xl mx-auto w-full mb-3 flex flex-col rounded-2xl px-8 saturate-100 backdrop-blur-[10px] overflow-hidden bg-gradient-to-t from-white/30 via-white/10 to-white/0 dark:from-black/30 dark:via-black/10 dark:to-black/0 shadow-xs">
      {/* Main content container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between w-full md:gap-0">

        {/* Left side: Spotify Logo and Status */}
        <div className="flex items-center gap-2">
          <a href="https://open.spotify.com/user/223qjmi62hl4nilhilo6lsdea" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <Image src={`${baseUrl}Spotify.svg`} alt="Spotify Logo" width={20} height={20} className="h-6 w-6" />
          </a>
          <SpotifyStatus />
        </div>

        {/* Right side: Social Media Links */}
        <SocialMediaLinks />

      </div>
      <div className="relative flex justify-center items-center">
        <Copyright />
      </div>
    </footer>
  );
}