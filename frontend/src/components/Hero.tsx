import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SocialPostsPreview from './SocialPostsPreview';
import Button from './Button';
import { BrainCircuit, Zap, Check, Pen, Cpu, Send, ChevronDown, 
  FileText, Edit, Bot, Type, PenTool, Scissors, Highlighter, BookOpen,
  Text, FileSpreadsheet, PencilRuler, AlignLeft } from 'lucide-react';
  interface FloatingIconProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    size?: number;
    className?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    animationDelay?: number;
  }
  const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, size = 88, className = "", top, left, right, animationDelay = 0 }) => {
    const Icon = icon;
    return (
      <motion.div 
        className={`absolute text-purple-300/30 ${className}`}
        style={{ top, left, right }}
        initial={{ y: 10, opacity:1 }}
        animate={{ 
          y: [0, -15, 0],
          rotate: [-5, 5, -5],
          opacity: [1, 1, 1],
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: animationDelay,
          ease: "easeInOut"
        }}
      >
        <Icon width={size} height={size} />
      </motion.div>
    );
  };
const Hero: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  // Robot logo animation
  const robotVariants = {
    idle: {
      rotate: [0, 10, 0, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center lg:justify-between justify-center h-screen md:py-24 px-6 lg:px-12 overflow-hidden">
            <div className="absolute inset-0">
        <div className="absolute animate-float-slow opacity-10 w-32 h-32 bg-white rounded-full top-1/4 left-1/4"></div>
        <div className="absolute animate-float opacity-10 w-24 h-24 bg-white rounded-full top-1/3 right-1/3"></div>
        <div className="absolute animate-float-slow opacity-10 w-40 h-40 bg-white rounded-full bottom-1/4 right-1/4"></div>
      </div>
      {/* Social Media Posts Image with Animation */}
            <FloatingIcon icon={Pen} size={18} top="25%" left="45%" animationDelay={0} />
            <FloatingIcon icon={FileText} size={20} top="30%" right="18%" animationDelay={1.5} />
            <FloatingIcon icon={Edit} size={16} bottom="45%" left="22%" animationDelay={2.3} />
            <FloatingIcon icon={PenTool} size={22} bottom="15%" right="15%" animationDelay={3.1} />
            <FloatingIcon icon={Type} size={18} top="40%" left="20%" animationDelay={0.7} />
      <motion.div
        className="w-full md:w-1/2 relative mb-8 md:mb-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <SocialPostsPreview />
      </motion.div>
      
      {/* Hero Text Content with Animations */}
      <motion.div
        className="w-full md:w-1/2 text-white text-center md:text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight font-sans"
          variants={itemVariants}
        >
          India's first of its own kind
        </motion.h1>
        
        <motion.div 
          className="flex items-center justify-center md:justify-start mb-4 relative overflow-hidden"
          variants={itemVariants}
        >
          <motion.span 
            className="text-4xl mr-2 z-10"
            initial={{ x: 0 }}
            animate={{ 
              x: [0, 40, 0],
              transition: {
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }
            }}
          >
            🤖
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-blue-400 font-sans tracking-wide origin-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: [0, 1, 1, 1],
              x: [-20, 0, 0, 0],
              transition: {
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 3,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut"
              }
            }}
          >
            AI featured
          </motion.h2>
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-6 font-sans tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
          variants={itemVariants}
        >
          Blogging Application
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl max-w-md mx-auto md:mx-0 mb-8 font-light leading-relaxed"
          variants={itemVariants}
        >
          Use AI to write your blogs with speed, accuracy, and perfect grammar. Create content faster without compromising on quality.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          variants={itemVariants}
        >
          <Button variant="primary" className="w-full sm:w-auto hover:scale-105 transition-transform">
            Get Started
          </Button>
          <Button variant="outline" className="w-full sm:w-auto hover:scale-105 transition-transform">
            Learn More
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;