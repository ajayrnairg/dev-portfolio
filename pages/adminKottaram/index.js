import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import Circles from "../../components/Circles";
import { authService } from "../../services";
import Link from "next/link";
import { FaUser, FaInfoCircle, FaBriefcase, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="h-full bg-primary/30 py-32 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const adminSections = [
    {
      title: "Profile Management",
      description: "Update your hero section, name, headline, and resume URL",
      icon: FaUser,
      path: "/adminKottaram/profile",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "About Section",
      description: "Manage your skills, experience, awards, and certifications",
      icon: FaInfoCircle,
      path: "/adminKottaram/about",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Work/Projects",
      description: "Add, edit, and manage your featured projects",
      icon: FaBriefcase,
      path: "/adminKottaram/work",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Contact Messages",
      description: "View contact form submissions and statistics",
      icon: FaEnvelope,
      path: "/adminKottaram/contact",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="h-full bg-primary/30 py-32 text-center xl:text-left overflow-visible">
      <Circles />
      <div className="container mx-auto h-full flex flex-col items-center xl:flex-row gap-x-6">
        {/* Header */}
        <div className="flex-1 flex flex-col justify-start pt-12 xl:pt-24">
          <motion.h2
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            className="h2 mt-12 xl:mt-0"
          >
            <span className="text-accent">Admin</span> Dashboard
          </motion.h2>

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
          >
            Manage your portfolio content from here. Update your profile,
            add new projects, and modify your about section.
          </motion.p>

          {/* Logout Button */}
          <motion.button
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            animate="show"
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 hover:text-red-300 transition-all duration-300 max-w-[200px] mx-auto xl:mx-0"
          >
            <FaSignOutAlt />
            Logout
          </motion.button>
        </div>

        {/* Admin Sections Grid */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          className="flex flex-col w-full xl:max-w-[48%] h-[480px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {adminSections.map((section, index) => (
              <Link key={index} href={section.path}>
                <motion.div
                  variants={fadeIn("up", 0.2 + index * 0.1)}
                  initial="hidden"
                  animate="show"
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-accent/50 transition-all duration-300 cursor-pointer group h-full flex flex-col"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <section.icon className="text-white text-xl" />
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed flex-grow">
                    {section.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex justify-end mt-4">
                    <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
