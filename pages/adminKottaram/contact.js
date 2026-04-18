import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import Circles from "../../components/Circles";
import { authService, profileService, adminService } from "../../services";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaEye, FaEnvelope, FaTrash, FaCheckSquare } from "react-icons/fa";

const AdminContact = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactData, setContactData] = useState({
    email: "",
    linkedinUrl: "",
    githubUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    facebookUrl: "",
  });
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [originalData, setOriginalData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("info"); // "info" or "submissions"

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.href = "/login";
      return;
    }

    setIsAuthenticated(true);
    loadContactData();
    loadSubmissions();
  }, []);

  const loadContactData = async () => {
    try {
      const data = await profileService.getProfile();
      const mappedData = {
        email: data.email || "",
        linkedinUrl: data.linkedinUrl || "",
        githubUrl: data.githubUrl || "",
        youtubeUrl: data.youtubeUrl || "",
        instagramUrl: data.instagramUrl || "",
        facebookUrl: data.facebookUrl || "",
      };
      setContactData(mappedData);
      setOriginalData(mappedData);
    } catch (error) {
      console.error("Failed to load contact data:", error);
      setMessage({ type: "error", text: "Failed to load contact data" });
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await adminService.getContactSubmissions();
      setSubmissions(data || []);
      setSelectedSubmissions([]);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await adminService.updateContact(contactData);
      setOriginalData(contactData);
      setMessage({ type: "success", text: "Contact information updated successfully!" });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to update contact:", error);
      setMessage({ type: "error", text: "Failed to update contact information. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await adminService.bulkDeleteContactSubmissions([submissionId]);
      setMessage({ type: "success", text: "Submission deleted successfully!" });
      await loadSubmissions();

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to delete submission:", error);
      setMessage({ type: "error", text: "Failed to delete submission. Please try again." });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubmissions.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedSubmissions.length} submissions?`)) {
      return;
    }

    try {
      await adminService.bulkDeleteContactSubmissions(selectedSubmissions);
      setMessage({ type: "success", text: "Selected submissions deleted completely!" });
      await loadSubmissions();

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to bulk delete:", error);
      setMessage({ type: "error", text: "Bulk deletion failed." });
    }
  };

  const toggleSelection = (id) => {
    setSelectedSubmissions((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSubmissions.length === submissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(submissions.map((s) => s.id));
    }
  };

  const hasChanges = JSON.stringify(contactData) !== JSON.stringify(originalData);

  if (loading) {
    return (
      <div className="h-full bg-primary/30 py-32 flex items-center justify-center">
        <div className="text-white text-xl">Loading contact data...</div>
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
              <span className="text-accent">Contact</span> Management
            </h2>
          </motion.div>

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
          >
            Manage your contact information and view form submissions from visitors.
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

          {/* Tab Navigation */}
          <motion.div
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            animate="show"
            className="flex gap-2 mb-6"
          >
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "info"
                  ? "bg-accent text-white"
                  : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              Contact Info
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-4 py-2 rounded-lg transition-colors relative ${
                activeTab === "submissions"
                  ? "bg-accent text-white"
                  : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              Submissions
              {submissions.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {submissions.length}
                </span>
              )}
            </button>
          </motion.div>

          {/* Preview Button */}
          <motion.button
            variants={fadeIn("right", 0.7)}
            initial="hidden"
            animate="show"
            onClick={() => window.open("/contact", "_blank")}
            className="flex items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/50 rounded-lg px-4 py-3 text-accent hover:text-white transition-all duration-300 max-w-[200px] mx-auto xl:mx-0"
          >
            <FaEye />
            Preview Contact
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          className="flex flex-col w-full xl:max-w-[48%] h-[600px]"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl h-full overflow-y-auto">
            {activeTab === "info" ? (
              /* Contact Info Form */
              <form className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Contact Information
                </h3>

                {/* Email Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-white/80 text-sm mb-2 font-medium flex items-center gap-2"
                  >
                    <FaEnvelope className="text-sm" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Social Media & Contact Links */}
                <div className="flex flex-col">
                  <label className="text-white/80 text-sm mb-2 font-medium">
                    Social Media & Contact Links
                  </label>

                  <input
                    type="url"
                    name="linkedinUrl"
                    value={contactData.linkedinUrl || ""}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors mb-3"
                    placeholder="LinkedIn URL"
                  />

                  <input
                    type="url"
                    name="githubUrl"
                    value={contactData.githubUrl || ""}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors mb-3"
                    placeholder="GitHub URL"
                  />

                  <input
                    type="url"
                    name="twitterUrl"
                    value={contactData.twitterUrl || ""}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors mb-3"
                    placeholder="Twitter URL (Optional)"
                  />

                  <input
                    type="url"
                    name="facebookUrl"
                    value={contactData.facebookUrl || ""}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors mb-3"
                    placeholder="Facebook URL"
                  />

                  <input
                    type="url"
                    name="youtubeUrl"
                    value={contactData.youtubeUrl || ""}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors mb-3"
                    placeholder="YouTube URL"
                  />

                  <input
                    type="url"
                    name="instagramUrl"
                    value={contactData.instagramUrl || ""}
                    onChange={handleInputChange}
                    className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors mb-3"
                    placeholder="Instagram URL"
                  />
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
            ) : (
              /* Submissions List */
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Form Submissions ({submissions.length})
                  </h3>
                  
                  {submissions.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition-colors text-white flex items-center gap-2"
                      >
                        <FaCheckSquare /> {selectedSubmissions.length === submissions.length ? "Deselect All" : "Select All"}
                      </button>
                      
                      {selectedSubmissions.length > 0 && (
                        <button
                          type="button"
                          onClick={handleBulkDelete}
                          className="bg-red-500/80 hover:bg-red-500 px-3 py-1 rounded text-sm transition-colors text-white flex items-center gap-2"
                        >
                          <FaTrash /> Delete ({selectedSubmissions.length})
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {submissions.length === 0 ? (
                  <div className="text-white/60 text-center py-8">
                    No submissions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="bg-black/30 rounded-lg p-4 border border-white/10 flex gap-4"
                      >
                        <div className="pt-1 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedSubmissions.includes(submission.id)}
                            onChange={() => toggleSelection(submission.id)}
                            className="w-5 h-5 rounded cursor-pointer border-2 border-white/50 text-accent focus:ring-accent accent-accent transition-all"
                            style={{ accentColor: '#f13024' }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-medium">
                                {submission.name}
                              </h4>
                              <p className="text-accent text-sm">{submission.email}</p>
                              <p className="text-white/50 text-xs">
                                {new Date(submission.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteSubmission(submission.id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <div className="text-white/80 text-sm">
                            <strong>Subject:</strong> {submission.subject}
                          </div>
                          <div className="text-white/70 text-sm mt-2">
                            <strong>Message:</strong>
                            <p className="mt-1 whitespace-pre-wrap">{submission.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminContact;
