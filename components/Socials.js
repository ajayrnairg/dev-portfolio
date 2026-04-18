import Link from "next/link";
import { useState, useEffect } from "react";
import { profileService } from "../services";

import {
  RiYoutubeLine,
  RiInstagramLine,
  RiFacebookLine,
  RiLinkedinLine,
  RiGithubLine,
  RiMailLine
} from "react-icons/ri";

const Socials = () => {
  const [socials, setSocials] = useState({});

  useEffect(() => {
    loadSocials();
  }, []);

  const loadSocials = async () => {
    try {
      const data = await profileService.getProfile();
      setSocials(data);
    } catch (error) {
      console.error("Failed to load socials:", error);
    }
  };

  return (
    <div className="flex items-center gap-x-5 text-lg">
      {socials.email && (
        <a href={`mailto:${socials.email}`} className="hover:text-accent transition-all duration-300">
          <RiMailLine />
        </a>
      )}
      {socials.linkedinUrl && (
        <Link href={socials.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-all duration-300">
          <RiLinkedinLine />
        </Link>
      )}
      {socials.githubUrl && (
        <Link href={socials.githubUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-all duration-300">
          <RiGithubLine />
        </Link>
      )}
      {socials.youtubeUrl && (
        <Link href={socials.youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-all duration-300">
          <RiYoutubeLine />
        </Link>
      )}
      {socials.instagramUrl && (
        <Link href={socials.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-all duration-300">
          <RiInstagramLine />
        </Link>
      )}
      {socials.facebookUrl && (
        <Link href={socials.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-accent transition-all duration-300">
          <RiFacebookLine />
        </Link>
      )}
    </div>
  );
};

export default Socials;