import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import Circles from "../../components/Circles";
import { authService, workService, adminService } from "../../services";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaEye, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const AdminWork = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailPath: "",
    techStack: [],
    ctaLinks: [],
  });

  const AVAILABLE_TECHS = [
    { label: "Next.js", value: "SiNextdotjs" },
    { label: "React", value: "SiReact" },
    { label: "Java", value: "FaJava" },
    { label: "Spring Boot", value: "SiSpringboot" },
    { label: "PostgreSQL", value: "SiPostgresql" },
    { label: "Python", value: "SiPython" },
    { label: "Azure", value: "SiMicrosoftazure" },
    { label: "Pandas", value: "SiPandas" },
    { label: "Google Colab", value: "SiGooglecolab" },
    { label: "Power BI", value: "SiPowerbi" },
    { label: "MS Teams", value: "SiMicrosoftteams" },
    { label: "Chrome", value: "SiGooglechrome" },
    { label: "MongoDB", value: "SiMongodb" },
    { label: "Express", value: "SiExpress" },
    { label: "Node.js", value: "SiNodedotjs" },
    { label: "HTML5", value: "SiHtml5" },
    { label: "CSS3", value: "SiCss3" },
    { label: "PHP", value: "SiPhp" },
    { label: "MySQL", value: "SiMysql" },
    { label: "Keras", value: "SiKeras" },
    { label: "GitHub Actions", value: "SiGithubactions" },
  ];

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    setIsAuthenticated(true);
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await workService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setMessage({ type: "error", text: "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTech = (techValue) => {
    setFormData((prev) => {
      const current = prev.techStack || [];
      if (current.includes(techValue)) {
        return { ...prev, techStack: current.filter((t) => t !== techValue) };
      } else {
        return { ...prev, techStack: [...current, techValue] };
      }
    });
  };

  const addCtaLink = () => {
    setFormData((prev) => ({
      ...prev,
      ctaLinks: [...(prev.ctaLinks || []), { label: "", url: "", iconName: "FaGithub" }],
    }));
  };

  const updateCtaLink = (index, field, value) => {
    setFormData((prev) => {
      const links = [...prev.ctaLinks];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, ctaLinks: links };
    });
  };

  const removeCtaLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      ctaLinks: prev.ctaLinks.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      thumbnailPath: "",
      techStack: [],
      ctaLinks: [],
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleAddProject = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setFormData({
      title: project.title || "",
      description: project.description || "",
      thumbnailPath: project.thumbnailPath || project.path || "",
      techStack: project.techStack || [],
      ctaLinks: project.ctaLinks || [],
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
        thumbnailPath: formData.thumbnailPath || "/thumb1.jpg"
      };

      if (editingProject) {
        await adminService.updateProject(editingProject.id, payload);
        setMessage({ type: "success", text: "Project updated successfully!" });
      } else {
        await adminService.createProject(payload);
        setMessage({ type: "success", text: "Project created successfully!" });
      }

      resetForm();
      await loadProjects();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to save project:", error);
      setMessage({ type: "error", text: "Failed to save project. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await adminService.deleteProject(projectId);
      setMessage({ type: "success", text: "Project deleted successfully!" });
      await loadProjects();

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setMessage({ type: "error", text: "Failed to delete project. Please try again." });
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-primary/30 py-32 flex items-center justify-center">
        <div className="text-white text-xl">Loading projects...</div>
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
            <Link href="/adminKottaram"  className="z-50">
              <button className="text-white/70 hover:text-white transition-colors">
                <FaArrowLeft className="text-xl" />
              </button>
            </Link>
            <h2 className="h2 mt-0">
              <span className="text-accent">Work</span> Management
            </h2>
          </motion.div>

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
          >
            Manage your portfolio projects. Add new projects, edit existing ones,
            or remove projects that are no longer relevant.
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

          {/* Add Project Button */}
          <motion.button
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            animate="show"
            onClick={handleAddProject}
            className="flex items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg px-4 py-3 text-accent hover:text-white transition-all duration-300 max-w-[200px] mx-auto xl:mx-0"
          >
            <FaPlus />
            Add Project
          </motion.button>

          {/* Preview Button */}
          <motion.button
            variants={fadeIn("right", 0.7)}
            initial="hidden"
            animate="show"
            onClick={() => window.open("/work", "_blank")}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white hover:text-accent transition-all duration-300 max-w-[200px] mx-auto xl:mx-0 mt-4"
          >
            <FaEye />
            Preview Work
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          className="flex flex-col w-full xl:max-w-[48%] h-[600px]"
        >
          {showForm ? (
            /* Form */
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-white/70 hover:text-white transition-colors z-500"
                >
                  ✕
                </button>
              </div>

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
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Project title"
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
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Project description"
                    required
                  />
                </div>

                {/* Image URL Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="thumbnailPath"
                    className="text-white/80 text-sm mb-2 font-medium"
                  >
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="thumbnailPath"
                    name="thumbnailPath"
                    value={formData.thumbnailPath}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="https://cloudinary.com/project-image.jpg"
                  />
                  <div className="text-white/40 text-xs mt-1">
                    Leave blank to use a default image.
                  </div>
                </div>

                {/* Tech Stack Field - UI Chip Grid */}
                <div className="flex flex-col">
                  <label className="text-white/80 text-sm mb-2 font-medium">
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-2 bg-black/40 border border-white/20 rounded-lg p-4">
                    {AVAILABLE_TECHS.map((tech) => {
                      const isSelected = formData.techStack?.includes(tech.value);
                      return (
                        <button
                          key={tech.value}
                          type="button"
                          onClick={() => toggleTech(tech.value)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            isSelected
                              ? "bg-accent text-primary border-accent"
                              : "bg-transparent text-white border-white/30 hover:border-white/60"
                          }`}
                        >
                          {tech.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Links Builder */}
                <div className="flex flex-col">
                  <label className="text-white/80 text-sm mb-2 font-medium flex justify-between items-center">
                    Call-to-Action Links (Optional)
                    <button
                      type="button"
                      onClick={addCtaLink}
                      className="text-accent hover:text-white transition-colors"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </label>
                  
                  {formData.ctaLinks?.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-start bg-black/20 p-2 rounded border border-white/10">
                      <input
                        type="text"
                        value={link.label || link.title || ""}
                        onChange={(e) => updateCtaLink(index, "label", e.target.value)}
                        className="bg-black/40 border border-white/20 rounded px-3 py-2 text-white text-sm w-1/3"
                        placeholder="Link Title (e.g. View Code)"
                      />
                      <input
                        type="url"
                        value={link.url || ""}
                        onChange={(e) => updateCtaLink(index, "url", e.target.value)}
                        className="bg-black/40 border border-white/20 rounded px-3 py-2 text-white text-sm flex-1"
                        placeholder="URL"
                      />
                      <button
                        type="button"
                        onClick={() => removeCtaLink(index)}
                        className="p-2 text-red-500 hover:text-red-400 mt-1"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                  {(!formData.ctaLinks || formData.ctaLinks.length === 0) && (
                    <div className="text-white/40 text-xs italic bg-black/20 p-3 rounded">
                      No links added. Click the + icon to add Live Demo or Source Code links.
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn bg-accent rounded-full border border-white/50 px-8 py-3 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-cyan-950 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  <span className="group-hover:translate-y-[120px] group-hover:opacity-0 transition-all duration-500">
                    {saving ? "Saving..." : "Save Project"}
                  </span>
                  <FaSave className="-translate-y-[120%] opacity-0 group-hover:flex group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]" />
                </button>
              </form>
            </div>
          ) : (
            /* Projects List */
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl h-full overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6">
                Your Projects ({projects.length})
              </h3>

              {projects.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  No projects yet. Click &quot;Add Project&quot; to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-black/30 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-2">
                            {project.title}
                          </h4>
                          <p className="text-white/70 text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies?.map((tech, index) => (
                              <span
                                key={index}
                                className="bg-accent/20 text-accent text-xs px-2 py-1 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-accent hover:text-white transition-colors p-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminWork;
