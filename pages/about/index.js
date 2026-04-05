import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

import Avatar from "../../components/Avatar";
import Circles from "../../components/Circles";
import CountUp from "react-countup";
import { aboutService } from "../../services";
import {
  FaCss3,
  FaJava,
  FaJs,
  FaNodeJs,
  FaPhp,
  FaPython,
  FaReact,
} from "react-icons/fa";
import {
  SiMicrosoftazure,
  SiMicrosoftsqlserver,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiRabbitmq,
  SiSpringboot,
} from "react-icons/si";

const iconMap = {
  FaJs: FaJs,
  FaReact: FaReact,
  SiNextdotjs: SiNextdotjs,
  FaJava: FaJava,
  SiSpringboot: SiSpringboot,
  FaPython: FaPython,
  FaNodeJs: FaNodeJs,
  FaPhp: FaPhp,
  SiMysql: SiMysql,
  SiMongodb: SiMongodb,
  SiMicrosoftazure: SiMicrosoftazure,
  FaCss3: FaCss3,
  SiMicrosoftsqlserver: SiMicrosoftsqlserver,
  SiRabbitmq: SiRabbitmq,
};

const About = () => {
  const [index, setIndex] = useState(0);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback about structure
  const fallbackAboutData = {
    leftSection: {
      title: "About Me",
      description:
        "Over the past 2.5+ years, my focus has been on engineering enterprise-grade solutions. At ISS-STOXX, I specialize in modernizing legacy architectures, optimizing high-volume data pipelines, and building seamless React interfaces for complex financial applications.",
      yearsExperience: "2.5+",
      projectsCompleted: "10+",
      techDebtReduced: "40%",
    },
    tabs: [
      {
        title: "skills",
        info: [
          {
            title: "Frontend & UI",
            icons: ["JS", "React", "Next.js", "CSS3"],
          },
          {
            title: "Backend & APIs",
            icons: ["Java", "Spring Boot", "Python", "Node.js", "PHP"],
          },
          {
            title: "Data & Cloud",
            icons: [
              "SQL Server",
              "MySQL",
              "MongoDB",
              "RabbitMQ",
              "Microsoft Azure",
            ],
          },
        ],
      },
      {
        title: "experience",
        info: [
          {
            title: "Full Stack Software Developer | ISS-STOXX",
            stage: "July 2023 - Present",
            description:
              "Engineered the modernization of legacy Spring Boot and React architectures for enterprise climate applications.",
          },
        ],
      },
      {
        title: "awards",
        info: [
          {
            title: "Microsoft AI for Earth Grant ($15,000 USD)",
            stage: "2021 - 2022",
            description:
              "Awarded for an AI-based statistical analysis project on land-use plastic pollution.",
          },
        ],
      },
      {
        title: "certifications",
        info: [
          {
            title: "B.E. Computer Engineering",
            stage: "University of Mumbai",
            description:
              "Secured a First Class with Distinction, graduating in 2023 with a CGPA of 9.7/10.0.",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await aboutService.getAbout();
        setAboutData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch about data:", err);
        setAboutData(fallbackAboutData);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const data = aboutData || fallbackAboutData;
  const leftSection = data.leftSection || fallbackAboutData.leftSection;
  const tabs = data.tabs || fallbackAboutData.tabs;

  // Get numeric values, defaulting to fallback values
  const yearsExp = parseFloat(leftSection.yearsExperience) || 2.5;
  const projects = parseInt(leftSection.projectsCompleted) || 10;
  const techDebt = parseInt(leftSection.techDebtReduced) || 40;

  return (
    <div className="h-full bg-primary/30 py-32 text-center xl:text-left overflow-visible">
      <Circles />
      {/* avatar img */}
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        animate="show"
        transition={{ duration: 1, ease: "easeInOut" }}
        className="hidden xl:flex absolute bottom-12 left-[-120px] -ml-[110px] !scale-[1.5]"
      >
        <Avatar />
      </motion.div>
      <div className="container mx-auto h-full flex flex-col items-center xl:flex-row gap-x-6">
        {/* text */}
        <div className="flex-1 flex flex-col justify-start pt-12 xl:pt-24">
          <motion.h2
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            className="h2 mt-12 xl:mt-0"
          >
            <span className="text-accent">Robust architecture</span> drives
            scalable systems.
          </motion.h2>

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
          >
            {leftSection.description}
          </motion.p>

          {error && (
            <motion.div
              variants={fadeIn("right", 0.5)}
              initial="hidden"
              animate="show"
              className="max-w-[500px] mx-auto xl:mx-0 mb-6 p-3 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-400 text-sm"
            >
              Note: Using cached data - please refresh to get latest from API
            </motion.div>
          )}

          {/* counters */}
          <motion.div
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            animate="show"
            className="md:max-w-xl xl:max-w-none mx-auto xl:mx-0 mb-8"
          >
            <div className="flex flex-1 xl:gap-x-6">
              {/* experience */}
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0">
                <div className="text-2xl xl:text-4xl font-extrabold text-accent mb-2">
                  <CountUp
                    decimal={"."}
                    decimals={1}
                    start={0}
                    end={yearsExp}
                    duration={5}
                  />{" "}
                  +
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  Years of experience
                </div>
              </div>
              {/* projects */}
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0">
                <div className="text-2xl xl:text-4xl font-extrabold text-accent mb-2">
                  <CountUp start={0} end={projects} duration={5} /> +
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  Projects
                </div>
              </div>
              {/* awards */}
              <div className="relative flex-1">
                <div className="text-2xl xl:text-4xl font-extrabold text-accent mb-2">
                  <CountUp start={0} end={techDebt} duration={5} suffix="%" /> +
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  Tech Debt Reduced
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* info */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          className="flex flex-col w-full xl:max-w-[48%] h-[480px]"
        >
          <div className="flex gap-x-4 xl:gap-x-8 mx-auto xl:mx-0 mb-4">
            {tabs.map((item, itemIndex) => {
              return (
                <div
                  key={itemIndex}
                  className={`${
                    index === itemIndex &&
                    "text-accent after:w-[100%] after:transition-all after:duration-300"
                  } cursor-pointer capitalize xl:text-lg relative after:w-8 after:h-[2px] after:bg-white after:absolute after:-bottom-1 after:left-0`}
                  onClick={() => setIndex(itemIndex)}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
          <div className="py-2 xl:py-6 flex flex-col gap-y-6 items-center xl:items-start overflow-y-auto max-h-[400px]">
            {tabs[index]?.info.map((item, itemIndex) => {
              return (
                <div
                  key={itemIndex}
                  className="flex flex-col gap-y-2 text-white/60 w-full"
                >
                  {/* Title */}
                  <div className="font-bold text-white text-lg">
                    {item.title}
                  </div>

                  {/* Stage/Date */}
                  {item.stage && (
                    <div className="text-sm text-accent">{item.stage}</div>
                  )}

                  {/* Description or Icons/Tags */}
                  {item.description ? (
                    <div className="text-sm">{item.description}</div>
                  ) : item.icons ? (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {item.icons.map((iconObj, idx) => {
                        // Look up the component in our map using the string from the API
                        const IconComponent =
                          typeof iconObj.icon === "string"
                            ? iconMap[iconObj.icon]
                            : iconObj.icon;

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-y-1"
                          >
                            <div className="text-2xl text-white">
                              {/* Render the component if found, otherwise show nothing */}
                              {IconComponent ? <IconComponent /> : null}
                            </div>
                            {/* Optional: Show the title under the icon like your backup */}
                            <span className="text-[10px] text-accent uppercase tracking-wider">
                              {iconObj.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
