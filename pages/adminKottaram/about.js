import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import Circles from "../../components/Circles";
import { authService, aboutService, adminService } from "../../services";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaEye, FaPlus, FaTrash } from "react-icons/fa";

const AdminAbout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    yearsExperience: "",
    projectsCompleted: "",
    techDebtReduced: "",
    skills: [],
    experience: [],
    awards: [],
    certifications: [],
  });
  const [originalData, setOriginalData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    setIsAuthenticated(true);
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await aboutService.getAbout();

      const transformedData = {
        title: data.leftSection?.title || "",
        description: data.leftSection?.description || "",
        yearsExperience: data.leftSection?.yearsExperience || "",
        projectsCompleted: data.leftSection?.projectsCompleted || "",
        techDebtReduced: data.leftSection?.techDebtReduced || "",
        skills: data.tabs?.find(tab => tab.title === "skills")?.info || [],
        experience: data.tabs?.find(tab => tab.title === "experience")?.info || [],
        awards: data.tabs?.find(tab => tab.title === "awards")?.info || [],
        certifications: data.tabs?.find(tab => tab.title === "certifications")?.info || [],
      };

      setAboutData(transformedData);
      setOriginalData(JSON.parse(JSON.stringify(transformedData)));
    } catch (error) {
      console.error("Failed to load about data:", error);
      setMessage({ type: "error", text: "Failed to load about data" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayItemChange = (arrayName, index, field, value) => {
    setAboutData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName, template = {}) => {
    setAboutData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setAboutData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const errors = [];
      const successes = [];

      // 1. Update left section if changed
      if (
        aboutData.title !== originalData.title ||
        aboutData.description !== originalData.description ||
        aboutData.yearsExperience !== originalData.yearsExperience ||
        aboutData.projectsCompleted !== originalData.projectsCompleted ||
        aboutData.techDebtReduced !== originalData.techDebtReduced
      ) {
        try {
          await adminService.updateAboutSection({
            title: aboutData.title,
            description: aboutData.description,
            yearsExperience: aboutData.yearsExperience,
            projectsCompleted: aboutData.projectsCompleted,
            techDebtReduced: aboutData.techDebtReduced,
          });
          successes.push("About section updated");
        } catch (error) {
          errors.push("Failed to update about section");
        }
      }

      // 2. Handle experience changes (add/delete/update)
      for (let i = 0; i < aboutData.experience.length; i++) {
        const exp = aboutData.experience[i];
        const origExp = originalData.experience?.[i];

        if (!origExp) {
          try {
            await adminService.addExperience({
              title: exp.title,
              stage: exp.stage,
              description: exp.description,
            });
            successes.push(`Experience "${exp.title}" added`);
          } catch (error) {
            errors.push(`Failed to add experience "${exp.title}"`);
          }
        } else if (
          exp.title !== origExp.title ||
          exp.stage !== origExp.stage ||
          exp.description !== origExp.description
        ) {
          try {
            await adminService.updateExperience(exp.id || origExp.id, {
              title: exp.title,
              stage: exp.stage,
              description: exp.description,
            });
            successes.push(`Experience "${exp.title}" updated`);
          } catch (error) {
            errors.push(`Failed to update experience "${exp.title}"`);
          }
        }
      }

      // Delete removed experience
      for (let i = aboutData.experience.length; i < (originalData.experience?.length || 0); i++) {
        const origExp = originalData.experience[i];
        if (origExp?.id) {
          try {
            await adminService.deleteExperience(origExp.id);
            successes.push(`Experience "${origExp.title}" deleted`);
          } catch (error) {
            errors.push(`Failed to delete experience "${origExp.title}"`);
          }
        }
      }

      // 3. Handle awards changes
      for (let i = 0; i < aboutData.awards.length; i++) {
        const award = aboutData.awards[i];
        const origAward = originalData.awards?.[i];

        if (!origAward) {
          try {
            await adminService.addAward({
              title: award.title,
              stage: award.stage,
              description: award.description,
            });
            successes.push(`Award "${award.title}" added`);
          } catch (error) {
            errors.push(`Failed to add award "${award.title}"`);
          }
        } else if (
          award.title !== origAward.title ||
          award.stage !== origAward.stage ||
          award.description !== origAward.description
        ) {
          try {
            await adminService.updateAward(award.id || origAward.id, {
              title: award.title,
              stage: award.stage,
              description: award.description,
            });
            successes.push(`Award "${award.title}" updated`);
          } catch (error) {
            errors.push(`Failed to update award "${award.title}"`);
          }
        }
      }

      // Delete removed awards
      for (let i = aboutData.awards.length; i < (originalData.awards?.length || 0); i++) {
        const origAward = originalData.awards[i];
        if (origAward?.id) {
          try {
            await adminService.deleteAward(origAward.id);
            successes.push(`Award "${origAward.title}" deleted`);
          } catch (error) {
            errors.push(`Failed to delete award "${origAward.title}"`);
          }
        }
      }

      // 4. Handle certifications changes
      for (let i = 0; i < aboutData.certifications.length; i++) {
        const cert = aboutData.certifications[i];
        const origCert = originalData.certifications?.[i];

        if (!origCert) {
          try {
            await adminService.addCertification({
              title: cert.title,
              stage: cert.stage,
              description: cert.description,
            });
            successes.push(`Certification "${cert.title}" added`);
          } catch (error) {
            errors.push(`Failed to add certification "${cert.title}"`);
          }
        } else if (
          cert.title !== origCert.title ||
          cert.stage !== origCert.stage ||
          cert.description !== origCert.description
        ) {
          try {
            await adminService.updateCertification(cert.id || origCert.id, {
              title: cert.title,
              stage: cert.stage,
              description: cert.description,
            });
            successes.push(`Certification "${cert.title}" updated`);
          } catch (error) {
            errors.push(`Failed to update certification "${cert.title}"`);
          }
        }
      }

      // Delete removed certifications
      for (let i = aboutData.certifications.length; i < (originalData.certifications?.length || 0); i++) {
        const origCert = originalData.certifications[i];
        if (origCert?.id) {
          try {
            await adminService.deleteCertification(origCert.id);
            successes.push(`Certification "${origCert.title}" deleted`);
          } catch (error) {
            errors.push(`Failed to delete certification "${origCert.title}"`);
          }
        }
      }

      // Set final message
      if (errors.length === 0 && successes.length > 0) {
        setMessage({ type: "success", text: "All changes saved successfully!" });
        setOriginalData(JSON.parse(JSON.stringify(aboutData)));
      } else if (errors.length > 0) {
        setMessage({ 
          type: "error", 
          text: `${errors.length} error(s) occurred: ${errors.join(", ")}` 
        });
      }

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
    } catch (error) {
      console.error("Failed to save about data:", error);
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(aboutData) !== JSON.stringify(originalData);

  if (loading) {
    return (
      <div className="h-full bg-primary/30 py-32 flex items-center justify-center">
        <div className="text-white text-xl">Loading about data...</div>
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
            <Link href="/admin"  className="z-50">
              <button className="text-white/70 hover:text-white transition-colors">
                <FaArrowLeft className="text-xl" />
              </button>
            </Link>
            <h2 className="h2 mt-0">
              <span className="text-accent">About</span> Management
            </h2>
          </motion.div>

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
          >
            Manage your about section content including skills, experience, awards, and certifications.
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
            onClick={() => window.open("/about", "_blank")}
            className="flex items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg px-4 py-3 text-accent hover:text-white transition-all duration-300 max-w-[200px] mx-auto xl:mx-0"
          >
            <FaEye />
            Preview About
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
              {/* Title Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="title"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={aboutData.title}
                  onChange={handleInputChange}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="About Me"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="description"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={aboutData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell your story..."
                  required
                />
                <div className="text-white/40 text-xs mt-1">
                  {aboutData.description.length}/1000 characters
                </div>
              </div>

              {/* Years Experience Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="yearsExperience"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Years of Experience
                </label>
                <input
                  type="text"
                  id="yearsExperience"
                  name="yearsExperience"
                  value={aboutData.yearsExperience}
                  onChange={handleInputChange}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., 2.5 +"
                />
              </div>

              {/* Projects Completed Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="projectsCompleted"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Projects Completed
                </label>
                <input
                  type="text"
                  id="projectsCompleted"
                  name="projectsCompleted"
                  value={aboutData.projectsCompleted}
                  onChange={handleInputChange}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., 10 +"
                />
              </div>

              {/* Tech Debt Reduced Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="techDebtReduced"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Tech Debt Reduced
                </label>
                <input
                  type="text"
                  id="techDebtReduced"
                  name="techDebtReduced"
                  value={aboutData.techDebtReduced}
                  onChange={handleInputChange}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., 40 %"
                />
              </div>

              {/* Skills Section (Read-Only) */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/80 text-sm font-medium">
                    Skills Categories (View Only)
                  </label>
                </div>
                <div className="text-white/60 text-xs mb-3">
                  ℹ️ Skills are managed separately. Update them through your backend.
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto bg-black/20 rounded-lg p-3">
                  {aboutData.skills.length === 0 ? (
                    <div className="text-white/40 text-sm">No skills loaded</div>
                  ) : (
                    aboutData.skills.map((skillCategory, index) => (
                      <div key={index} className="bg-black/30 rounded p-2 text-sm">
                        <div className="text-white font-medium mb-1">
                          {skillCategory.title}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {skillCategory.icons?.map((icon, iconIndex) => (
                            <span
                              key={iconIndex}
                              className="bg-accent/20 text-accent text-xs px-2 py-1 rounded"
                            >
                              {icon.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/80 text-sm font-medium">
                    Experience
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("experience", { title: "", stage: "", description: "" })}
                    className="text-accent hover:text-white transition-colors"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {aboutData.experience.map((exp, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) =>
                            handleArrayItemChange("experience", index, "title", e.target.value)
                          }
                          className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm"
                          placeholder="Job Title | Company"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("experience", index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={exp.stage}
                        onChange={(e) =>
                          handleArrayItemChange("experience", index, "stage", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm mb-2"
                        placeholder="Period (e.g., July 2023 - Present)"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) =>
                          handleArrayItemChange("experience", index, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                        placeholder="Description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards Section */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/80 text-sm font-medium">
                    Awards
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("awards", { title: "", stage: "", description: "" })}
                    className="text-accent hover:text-white transition-colors"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {aboutData.awards.map((award, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) =>
                            handleArrayItemChange("awards", index, "title", e.target.value)
                          }
                          className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm"
                          placeholder="Award title"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("awards", index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={award.stage}
                        onChange={(e) =>
                          handleArrayItemChange("awards", index, "stage", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm mb-2"
                        placeholder="Year/Date (e.g., 2021 - 2022)"
                      />
                      <textarea
                        value={award.description}
                        onChange={(e) =>
                          handleArrayItemChange("awards", index, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                        placeholder="Award description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/80 text-sm font-medium">
                    Certifications
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("certifications", { title: "", stage: "", description: "" })}
                    className="text-accent hover:text-white transition-colors"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {aboutData.certifications.map((cert, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) =>
                            handleArrayItemChange("certifications", index, "title", e.target.value)
                          }
                          className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm"
                          placeholder="Certification title"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("certifications", index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={cert.stage}
                        onChange={(e) =>
                          handleArrayItemChange("certifications", index, "stage", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm mb-2"
                        placeholder="Institution/Year (e.g., University of Mumbai)"
                      />
                      <textarea
                        value={cert.description}
                        onChange={(e) =>
                          handleArrayItemChange("certifications", index, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                        placeholder="Certification description"
                      />
                    </div>
                  ))}
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

export default AdminAbout;
