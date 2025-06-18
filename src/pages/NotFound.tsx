import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Telescope, Home, ArrowRight } from "lucide-react"; // Using Telescope for a "searching" theme

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      // Stagger children animations for elegance
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, filter: "blur(5px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    // Use spring for a pleasant, bouncy arrival
    transition: { type: "spring", stiffness: 80, damping: 14 },
  },
};

// Floating animation for the icon
const floatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  },
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden relative p-4 text-white">
      {/* --- Background Decorations: Subtle Floating Particles (Attractive) --- */}
      <Star duration={40} className="top-1/4 left-1/3 w-2 h-2" />
      <Star duration={50} className="top-1/2 left-1/4 w-1 h-1" />
      <Star duration={30} className="bottom-1/4 right-1/3 w-2 h-2" />
      <Star duration={60} className="bottom-1/2 right-1/4 w-1 h-1" />
      <BlurryBlob
        duration={25}
        className="top-1/4 left-1/4 w-72 h-72 bg-pink-500/30"
      />
      <BlurryBlob
        duration={35}
        className="bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/30"
      />

      {/* --- Main Content Card (Elegant Glassmorphism) --- */}
      <motion.div
        className="relative z-10 bg-white/10 dark:bg-gray-800/30 p-8 sm:p-12 rounded-3xl shadow-2xl text-center max-w-xl w-full backdrop-blur-xl border border-white/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- Floating Icon --- */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <motion.div
            animate={floatAnimation} // Apply continuous floating
            className="p-4 bg-white/10 rounded-full shadow-inner"
          >
            <Telescope size={64} className="text-pink-400" />
          </motion.div>
        </motion.div>

        {/* --- Gradient 404 Title (Attractive & Rich) --- */}
        <motion.h1
          variants={itemVariants}
          className="text-9xl font-extrabold mb-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
            404
          </span>
        </motion.h1>

        {/* --- Text Content --- */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-semibold text-white mb-4"
        >
          Lost in the cosmos?
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-200 mb-8 text-lg"
        >
          {/* Keeping the original Bengali text */}
          মনে হচ্ছে আপনি ভুল লিংকে চলে এসেছেন। এই পেইজটি খুঁজে পাওয়া যায়নি।
        </motion.p>

        {/* --- Elegant Primary Button --- */}
        <motion.div variants={itemVariants}>
          <Link to="/">
            <motion.button
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-pink-500/40"
              // Smooth hover and tap interactions
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={20} className="mr-2" />
              হোমপেজে ফিরে যান
            </motion.button>
          </Link>
        </motion.div>

        {/* --- Optional: Secondary Links --- */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-4 border-t border-white/10"
        >
          <Link
            to="/support"
            className="text-sm text-gray-300 hover:text-pink-400 transition-colors"
          >
            Need Help? Visit Support{" "}
            <ArrowRight className="inline-block ml-1" size={14} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- Helper Components for Background Effects ---

const BlurryBlob = ({ duration, className }) => (
  <motion.div
    className={`absolute rounded-full mix-blend-overlay filter blur-3xl opacity-70 ${className}`}
    animate={{
      x: [0, 50, 0, -50, 0],
      y: [0, -30, -60, -30, 0],
      scale: [1, 1.2, 1],
      rotate: [0, 10, 0, -10, 0],
    }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Star = ({ duration, className }) => (
  <motion.div
    className={`absolute bg-white rounded-full shadow-lg shadow-white/50 ${className}`}
    animate={{
      opacity: [0.5, 1, 0.5],
      scale: [0.8, 1.1, 0.8],
    }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
  />
);

export default NotFound;
