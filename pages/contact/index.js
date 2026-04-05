import { useState } from 'react';
import Circles from '../../components/Circles';
import { BsArrowRight } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import { contactService } from '../../services';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Validate that required fields are filled
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.message.trim() || formData.message.trim().length < 10) {
        throw new Error('Message is required and must be at least 10 characters');
      }

      // Send message via contact service
      const response = await contactService.sendMessage(formData);

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setSubmitStatus('success');

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-primary/30 ">
      <div className="container mx-auto py-32 text-center xl:text-left flex items-center justify-center h-full">
        <div className="flex flex-col w-full max-w-[700px]">
          {/* text */}
          <motion.h2
            variants={fadeIn('up', '0.2')}
            initial="hidden"
            animate="show"
            className="h2 text-center mb-12"
          >
            Let&apos;s <span className="text-accent">connect.</span>
          </motion.h2>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              variants={fadeIn('up', '0.3')}
              initial="hidden"
              animate="show"
              className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded text-green-400 text-center"
            >
              ✓ Message sent successfully! I&apos;ll get back to you soon.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              variants={fadeIn('up', '0.3')}
              initial="hidden"
              animate="show"
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-400 text-center"
            >
              ✗ {errorMessage}
            </motion.div>
          )}

          {/* form */}
          <motion.form
            variants={fadeIn('up', '0.4')}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col gap-6 w-full mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-x-6 w-full">
              <input
                type="text"
                name="name"
                placeholder="name"
                className="input"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="email"
                className="input"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="subject"
              className="input"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            <textarea
              name="message"
              placeholder="message (minimum 10 characters)"
              className="textarea"
              value={formData.message}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn bg-accent rounded-full border border-white/50 px-8 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-cyan-950 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="group-hover:translate-y-[120px] group-hover:opacity-0 transition-all duration-500">
                {isSubmitting ? 'Sending...' : "Let's talk"}
              </span>
              <BsArrowRight className="-translate-y-[120%] opacity-0 group-hover:flex group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]" />
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
