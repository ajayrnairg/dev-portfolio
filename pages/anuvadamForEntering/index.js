import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import Circles from "../../components/Circles";
import { authService } from "../../services";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      // Redirect to admin dashboard if already logged in
      window.location.href = "/admin";
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Basic validation
      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }
      if (!formData.password.trim()) {
        throw new Error("Password is required");
      }

      // Attempt login
      const response = await authService.login(formData.email, formData.password);

      setSuccess("Login successful! Redirecting to admin dashboard...");

      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        window.location.href = "/adminKottaram";
      }, 1500);

    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-primary/30 py-32 text-center xl:text-left overflow-visible">
      <Circles />
      <div className="container mx-auto h-full flex flex-col items-center xl:flex-row gap-x-6">
        {/* text */}
        <div className="flex-1 flex flex-col justify-center pt-12 xl:pt-24">
          <motion.h2
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            className="h2 mt-12 xl:mt-0"
          >
            <span className="text-accent">Admin</span> Access
          </motion.h2>

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
          >
            Secure login to manage your portfolio content. Update your profile,
            add new projects, and modify your about section.
          </motion.p>

          {/* Error Message */}
          {error && (
            <motion.div
              variants={fadeIn("right", 0.5)}
              initial="hidden"
              animate="show"
              className="max-w-[500px] mx-auto xl:mx-0 mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              variants={fadeIn("right", 0.5)}
              initial="hidden"
              animate="show"
              className="max-w-[500px] mx-auto xl:mx-0 mb-6 p-4 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm"
            >
              {success}
            </motion.div>
          )}
        </div>

        {/* Login Form */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          className="flex flex-col w-full xl:max-w-[48%] h-[480px]"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <motion.form
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              {/* Email Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-white/80 text-sm mb-2 font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn bg-accent rounded-full border border-white/50 px-8 py-3 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-cyan-950 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                <span className="group-hover:translate-y-[120px] group-hover:opacity-0 transition-all duration-500">
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </span>
                <span className="-translate-y-[120%] opacity-0 group-hover:flex group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]">
                  →
                </span>
              </button>
            </motion.form>

            {/* Security Note */}
            <div className="mt-6 text-center">
              <p className="text-white/40 text-xs">
                This login is protected and requires valid credentials.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
