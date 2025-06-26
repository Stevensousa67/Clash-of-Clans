import Image from 'next/image';
import { socialMedia } from '@/lib/socialMedia';


export interface SocialMediaItem {
    name: string;
    url: string;
    icon: string;
}   

export default function SocialMediaLinks() {
  return (
    <div className="flex flex-row justify-center items-center gap-4 p-4">
      {socialMedia.map((media) => (
        <a href={media.url} target="_blank" rel="noopener noreferrer" key={media.name} className="cursor-pointer">
          <Image src={media.icon} alt={`${media.name} Icon`} width={20} height={20} className="filter dark:invert" />
        </a>
      ))}
    </div>
  );
}