import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import Circles from "../../components/Circles";
import { authService, profileService, adminService } from "../../services";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaEye } from "react-icons/fa";

const AdminProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    headline: "",
    subHeadline: "",
    resumeUrl: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    setIsAuthenticated(true);
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const data = await profileService.getProfile();
      setProfileData(data);
      setOriginalData(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await adminService.updateProfile(profileData);
      setOriginalData(profileData);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData);

  if (loading) {
    return (
      <div className="h-full bg-primary/30 py-32 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile data...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-full bg-primary/30 py-32 text-center xl:text-left overflow-visible">
      <Circles />
      <div className="container mx-auto h-full flex flex-col items-center xl:flex-row gap-x-6">
        {/* Header */}
        <div className="flex-1 flex flex-col justify-start pt-12 xl:pt-24">
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            className="flex items-center gap-4 mb-6"
          >
            <Link href="/adminKottaram" className="z-50">
              <button className="text-white/70 hover:text-white transition-colors">
                <FaArrowLeft className="text-xl" />
              </button>
            </Link>
            <h2 className="h2 mt-0">
              <span className="text-accent">Profile</span> Management
            </h2>
          </motion.div>

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
          >
            Update your hero section content. This appears on your homepage
            and represents your professional identity.
          </motion.p>

          {/* Message */}
          {message.text && (
            <motion.div
              variants={fadeIn("right", 0.5)}
              initial="hidden"
              animate="show"
              className={`max-w-[500px] mx-auto xl:mx-0 mb-6 p-4 rounded text-sm ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500 text-green-400"
                  : "bg-red-500/20 border border-red-500 text-red-400"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Preview Button */}
          <motion.button
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            animate="show"
            onClick={() => window.open("/", "_blank")}
            className="flex items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg px-4 py-3 text-accent hover:text-white transition-all duration-300 max-w-[200px] mx-auto xl:mx-0"
          >
            <FaEye />
            Preview Site
          </motion.button>
        </div>

        {/* Form */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          className="flex flex-col w-full xl:max-w-[48%] h-[600px]"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl h-full overflow-y-auto">
            <form className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* Headline Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="headline"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Headline *
                </label>
                <input
                  type="text"
                  id="headline"
                  name="headline"
                  value={profileData.headline}
                  onChange={handleInputChange}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., Senior Full Stack Developer"
                  required
                />
              </div>

              {/* Sub Headline Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="subHeadline"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Sub Headline *
                </label>
                <textarea
                  id="subHeadline"
                  name="subHeadline"
                  value={profileData.subHeadline}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Brief description of your expertise and experience"
                  required
                />
                <div className="text-white/40 text-xs mt-1">
                  {profileData.subHeadline.length}/200 characters
                </div>
              </div>

              {/* Resume URL Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="resumeUrl"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Resume URL *
                </label>
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={profileData.resumeUrl}
                  onChange={handleInputChange}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="https://cloudinary.com/your-resume.pdf"
                  required
                />
                <div className="text-white/40 text-xs mt-1">
                  Link to your resume hosted on Cloudinary or similar service
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="btn bg-accent rounded-full border border-white/50 px-8 py-3 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-cyan-950 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                <span className="group-hover:translate-y-[120px] group-hover:opacity-0 transition-all duration-500">
                  {saving ? "Saving..." : "Save Changes"}
                </span>
                <FaSave className="-translate-y-[120%] opacity-0 group-hover:flex group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]" />
              </button>

              {/* Changes Indicator */}
              {hasChanges && (
                <div className="text-yellow-400 text-sm text-center">
                  You have unsaved changes
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;
