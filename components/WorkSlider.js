import React from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { Dialog, Flex, Button } from "@radix-ui/themes";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";

import { FaGithub, FaJava, FaVideo } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import {
  SiCss3,
  SiExpress,
  SiGithubactions,
  SiGooglechrome,
  SiGooglecolab,
  SiHtml5,
  SiKeras,
  SiMicrosoftazure,
  SiMicrosoftteams,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPandas,
  SiPhp,
  SiPostgresql,
  SiPowerbi,
  SiPython,
  SiReact,
  SiSpringboot,
  SiStmicroelectronics,
} from "react-icons/si";
import { VscLiveShare } from "react-icons/vsc";

// Mapping for tech stack icons from API response
const techStackIconMap = {
  SiNextdotjs: SiNextdotjs,
  SiReact: SiReact,
  FaJava: FaJava,
  SiSpringboot: SiSpringboot,
  SiPostgresql: SiPostgresql,
  SiPython: SiPython,
  SiMicrosoftazure: SiMicrosoftazure,
  SiPandas: SiPandas,
  SiGooglecolab: SiGooglecolab,
  SiPowerbi: SiPowerbi,
  SiMicrosoftteams: SiMicrosoftteams,
  SiGooglechrome: SiGooglechrome,
  SiMongodb: SiMongodb,
  SiExpress: SiExpress,
  SiNodedotjs: SiNodedotjs,
  SiHtml5: SiHtml5,
  SiCss3: SiCss3,
  SiPhp: SiPhp,
  SiMysql: SiMysql,
  SiKeras: SiKeras,
  SiGithubactions: SiGithubactions,
};

// Helper function to get icon for CTA links
const getLinkIcon = (title) => {
  switch ((title || "").toLowerCase()) {
    case 'view code':
      return FaGithub;
    case 'live demo':
      return VscLiveShare;
    case 'video demo':
      return FaVideo;
    case 'research paper':
      return IoNewspaperOutline;
    default:
      return FaGithub;
  }
};

// Helper function to convert tech stack array to icon components
const getTechStackIcons = (techStackArray) => {
  if (!Array.isArray(techStackArray)) return [];
  return techStackArray
    .map((tech) => {
      // If it's already an icon component (from fallback data)
      if (typeof tech === "function") return tech;
      // If it's a string (from API), convert to icon
      return techStackIconMap[tech] || null;
    })
    .filter(Boolean);
};

// Fallback data
const workSlides = {
  slides: [
    {
      images: [
        {
          title: "High-Performance Developer Portfolio",
          path: "/thumb1.jpg",
          techStack: [SiNextdotjs, SiReact, FaJava, SiSpringboot, SiPostgresql],
          description:
            "Engineered a custom, responsive portfolio application utilizing Server-Side Rendering (SSR) for optimal SEO and a 100/100 Lighthouse performance score. Implemented automated CI/CD deployment pipelines.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
        {
          title: "Predictive Plastic Footprint Analysis (Microsoft AI Grant)",
          path: "/thumb2.jpg",
          techStack: [
            SiMicrosoftazure,
            SiPython,
            SiPandas,
            SiGooglecolab,
            SiPowerbi,
          ],
          description:
            "Award-winning statistical analysis project mapping 10 years of land-use plastic pollution in India. Built predictive machine learning models hosted on Azure Virtual Machines.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
        {
          title: "GistGator: AI Meeting Summarizer",
          path: "/thumb3.jpg",
          techStack: [SiPython, SiMicrosoftteams, SiGooglechrome],
          description:
            "Developed an end-to-end NLP pipeline that ingests audio/video streams to generate automated meeting transcripts and abstractive summaries. Packaged as an interactive Chrome extension.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
        {
          title: "LBS EdTech Platform",
          path: "/thumb4.jpg",
          techStack: [SiMongodb, SiExpress, SiReact, SiNodedotjs],
          description:
            "Designed and developed a comprehensive e-learning platform featuring secure user authentication, interactive exam modules, and a role-based admin dashboard for content management.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
      ],
    },
    {
      images: [
        {
          title: "Academic Conference Management System",
          path: "/thumb4.jpg",
          techStack: [SiMongodb, SiExpress, SiReact, SiNodedotjs],
          description:
            "Developed a full-stack conference portal during my role as a Full Stack Developer at the VESIT Renaissance Cell. Engineered a secure admin dashboard for total site editability and led the development lifecycle using Scrum methodologies.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
        {
          title: "Industry 4.0 AI & OCR Pipeline (TIFR)",
          path: "/thumb1.jpg",
          techStack: [SiPython, SiGooglecolab, SiKeras, SiStmicroelectronics],
          description:
            "Developed an end-to-end wireless data extraction architecture for industrial display units. Engineered a custom streaming pipeline using ESP32-CAM modules and optimized deep learning OCR models (KerasOCR & EasyOCR) for real-time text detection.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
        {
          title: "Serverless Flight Price Tracker",
          path: "/thumb2.jpg",
          techStack: [SiPython, SiPandas, SiGithubactions],
          description:
            "Developed an automated, serverless data aggregator that tracks specific flight routes. Utilized GitHub Actions as a cron scheduler to execute a Python script daily, which queries external flight APIs, runs comparison logic for the best deals, and dispatches automated email reports.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
        {
          title: "HR & Payroll Database System",
          path: "/thumb3.jpg",
          techStack: [SiHtml5, SiCss3, SiPhp, SiMysql],
          description:
            "Designed and integrated a comprehensive database schema for an internal management portal dealing with employee salaries and leave tracking. Focused on complex SQL querying, data normalization, and backend integration.",
          ctaLinks: [
            { title: "View Code", icon: FaGithub, url: "https://github.com" },
            {
              title: "Live Demo",
              icon: VscLiveShare,
              url: "https://example.com",
            },
            { title: "Video Demo", icon: FaVideo, url: "https://example.com" },
            {
              title: "Research Paper",
              icon: IoNewspaperOutline,
              url: "https://example.com",
            },
          ],
        },
      ],
    },
  ],
};

const WorkSlider = ({ projects }) => {
  // Determine if we should use API projects or fallback
  const hasApiProjects =
    projects && Array.isArray(projects) && projects.length > 0;

  // Helper component to render individual project
  const ProjectCard = ({ project }) => {
    const techs = getTechStackIcons(project.techStack || []);

    return (
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="relative rounded-lg overflow-hidden flex items-center justify-center group">
            <div className="flex items-center justify-center relative overflow-hidden group">
              {/* image */}
              <Image
                src={project.thumbnailPath || project.path || "/thumb1.jpg"}
                width={500}
                height={300}
                alt={project.title}
              />
              {/* overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-80 transition-all duration-700"></div>
              {/* title */}
              <div className="absolute bottom-0 translate-y-full group-hover:-translate-y-10 group-hover:xl:-translate-y-20 transition-all duration-300 w-full px-4 text-center">
                <div className="flex flex-col gap-y-5 text-[13px] tracking-[0.2rem]">
                  <div className="delay-100 text-lg font-bold text-white uppercase leading-tight">
                    {project.title}
                  </div>
                  <div className="flex items-center justify-center gap-x-2 translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150">
                    <span className="text-white/80">VIEW DETAILS</span>
                    <div className="text-xl transition-all duration-300 delay-200">
                      <BsArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Trigger>
        <Dialog.Content
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6"
          style={{ maxWidth: 700 }}
        >
          <Dialog.Title size="5" mb="4" className="text-white font-bold">
            {project.title}
          </Dialog.Title>

          <Dialog.Description>
            <Flex direction="column" gap="5">
              {/* Tech Stack Row */}
              <Flex
                gap="3"
                align="center"
                className="pb-2 border-b border-white/5"
              >
                {techs.length > 0 ? (
                  techs.map((TechIcon, index) => (
                    <div
                      key={index}
                      className="text-white/60 hover:text-cyan-400 transition-colors"
                    >
                      <TechIcon size={22} />
                    </div>
                  ))
                ) : (
                  <span className="text-white/40 text-sm">No technologies listed</span>
                )}
              </Flex>

              {/* Description Text */}
              <div className="text-white/80 leading-relaxed text-sm md:text-base">
                {project.description}
              </div>

              {/* Action Buttons Row */}
              <Flex gap="3" wrap="wrap" className="mt-2">
                {project.ctaLinks && project.ctaLinks.length > 0 ? (
                  project.ctaLinks.map((link, index) => {
                    // Handle both API format and fallback format
                    const iconComponent =
                      typeof link.icon === "function"
                        ? link.icon
                        : getLinkIcon(link.title || link.label);

                    const displayTitle = link.title || link.label;
                    const linkUrl = link.url || "#";

                    return (
                      <Button
                        key={index}
                        variant="soft"
                        color="cyan"
                        highContrast
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(linkUrl, "_blank")}
                      >
                        {React.createElement(iconComponent)}
                        {displayTitle}
                      </Button>
                    );
                  })
                ) : (
                  <span className="text-white/40 text-sm">No links available</span>
                )}
              </Flex>
            </Flex>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
    );
  };

  return (
    <Swiper
      breakpoints={{
        320: {
          direction: "vertical",
        },
        640: {
          direction: "horizontal",
        },
      }}
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="h-[280px] sm:h-[480px]"
    >
      {hasApiProjects ? (
        // Render API projects in a 2x2 grid (4 projects per slide)
        Array.from({
          length: Math.ceil(projects.length / 4),
        }).map((_, slideIndex) => (
          <SwiperSlide key={slideIndex}>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 cursor-pointer">
              {projects
                .slice(slideIndex * 4, (slideIndex + 1) * 4)
                .map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
            </div>
          </SwiperSlide>
        ))
      ) : (
        // Fallback to hardcoded data
        workSlides.slides.map((slide, slideIndex) => (
          <SwiperSlide key={slideIndex}>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 cursor-pointer">
              {slide.images.map((image, index) => (
                <ProjectCard key={index} project={image} />
              ))}
            </div>
          </SwiperSlide>
        ))
      )}
    </Swiper>
  );
};

export default WorkSlider;
