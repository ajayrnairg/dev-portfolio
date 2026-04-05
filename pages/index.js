import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import ParticlesContainer from '../components/ParticlesContainer';
import ProjectsBtn from '../components/ProjectsBtn';
import Avatar from '../components/Avatar';
import { fadeIn } from '../variants';
import { profileService } from '../services';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data in case API fails
  const fallbackProfile = {
    name: 'Ajay Nair',
    headline: 'Senior Full Stack Developer',
    subHeadline:
      'Full Stack Developer with 2.6+ years of experience bridging the gap between complex backend logic and intuitive user interfaces. Experienced in modernizing enterprise systems for stability and speed.',
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // Use fallback data if API fails
        setProfile(fallbackProfile);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const displayProfile = profile || fallbackProfile;
  const headLinePt1 = displayProfile.headline.split(' ').slice(0, 3).join(' ');
  const headLinePt2 = displayProfile.headline.split(' ').slice(3).join(' ');

  return (
    <div className="bg-primary/60 h-full">
      <div className="w-full h-full bg-gradient-to-r from-primary/10 via-black/30 to-black/10">
        <div className="text-center flex flex-col justify-center xl:pt-40 xl:text-left h-full container mx-auto ">
          <motion.h1
            variants={fadeIn('down', 0.2)}
            initial="hidden"
            animate="show"
            className="h1"
          >
            {headLinePt1} <br />
            <span className="text-accent">{headLinePt2}</span>
          </motion.h1>

          <motion.p
            variants={fadeIn('down', 0.3)}
            initial="hidden"
            animate="show"
            className="max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-10 xl:mb-16 font-bold"
          >
            {displayProfile.subHeadline}
          </motion.p>

          {error && (
            <motion.div
              variants={fadeIn('down', 0.25)}
              initial="hidden"
              animate="show"
              className="max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-6 p-3 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-400 text-sm"
            >
              Note: Using local data - API temporarily unavailable
            </motion.div>
          )}

          <div className="flex justify-center xl:hidden relative">
            <ProjectsBtn/>
          </div>
          <motion.div
            variants={fadeIn('down', 0.4)}
            initial="hidden"
            animate="show"
            className="hidden xl:flex"
          >
            <ProjectsBtn/>
          </motion.div>
        </div>
      </div>

      {/* image */}
      <div className="w-[1200px] h-full absolute right-0 bottom-0">
        <div className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-screen translate-z-0 animate-pulse duration-150 hue-rotate-180"></div>

        {/* particles*/}
        <ParticlesContainer />

        {/* avatar img */}
        <motion.div
          variants={fadeIn('up', 0.5)}
          initial="hidden"
          animate="show"
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="w-full h-full max-w-[737px] max-h-[678px] absolute -bottom-32 lg:bottom-0 lg:right-[8%]"
        >
          <Avatar />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
