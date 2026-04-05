import { useEffect, useState } from 'react';
import WorkSlider from "./../../components/WorkSlider";
import Bulb from './../../components/Bulb';
import Circles from './../../components/Circles';

import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import { workService } from '../../services';

const Work = () => {
  const [workData, setWorkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback description
  const fallbackDescription =
    'A curated selection of my technical builds, ranging from high-performance web applications to award-winning machine learning research. Each project highlights my focus on scalable architecture, cloud integration, and delivering seamless user experiences from the backend to the frontend.';

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const data = await workService.getWork();
        setWorkData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch work data:', err);
        // Use fallback - API will provide the data, but initially use placeholder
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, []);

  return (
    <div className="h-full bg-primary/30 py-36 flex items-center">
      <Circles />
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-x-8">
          {/* text */}
          <div className="text-center flex xl:w-[30vw] flex-col lg:text-left mb-4 xl:mb-0">
            <motion.h2
              variants={fadeIn('up', 0.2)}
              initial="hidden"
              animate="show"
              className="h2 xl:mt-12"
            >
              Featured Engineering <span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn('up', 0.4)}
              initial="hidden"
              animate="show"
              className="mb-4 max-w-[400px] mx-auto lg:mx-0"
            >
              {workData?.description || fallbackDescription}
            </motion.p>
            {error && (
              <motion.div
                variants={fadeIn('up', 0.5)}
                initial="hidden"
                animate="show"
                className="p-2 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-400 text-sm mt-4"
              >
                Loading from API - displaying sample projects
              </motion.div>
            )}
          </div>
          {/* slider */}
          <motion.div
            variants={fadeIn('down', 0.6)}
            initial="hidden"
            animate="show"
            className="w-full xl:max-w-[65%]"
          >
            <WorkSlider projects={workData?.projects} />
          </motion.div>
        </div>
      </div>
      <Bulb />
    </div>
  );
};

export default Work;
