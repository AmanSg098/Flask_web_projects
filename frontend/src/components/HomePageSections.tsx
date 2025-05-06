import React, { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Zap, Check, Pen, Cpu, Send, ChevronDown, 
         FileText, Edit, Bot, Type, PenTool, Scissors, Highlighter, BookOpen,
         Text, FileSpreadsheet, PencilRuler, AlignLeft } from 'lucide-react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';

// Floating Icon Component
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

// Key Features Section
export const KeyFeatures = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const features = [
    {
      icon: <BrainCircuit size={32} className="text-indigo-600" />,
      title: "Speed Writing",
      description: "Generate 500-word posts in seconds."
    },
    {
      icon: <Check size={32} className="text-green-600" />,
      title: "Grammar Perfection",
      description: "Error-free, SEO-friendly copy."
    },
    {
      icon: <Zap size={32} className="text-amber-500" />,
      title: "Tone Control",
      description: "Switch between professional, friendly, or witty."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-16 bg-none relative overflow-hidden">
      {/* Floating Writing Icons */}
      {/* <FloatingIcon icon={Pen} size={18} top="15%" left="5%" animationDelay={0} />
      <FloatingIcon icon={FileText} size={20} top="20%" right="8%" animationDelay={1.5} /> */}
      <FloatingIcon icon={Edit} size={16} bottom="25%" left="12%" animationDelay={2.3} />
      <FloatingIcon icon={PenTool} size={22} bottom="15%" right="15%" animationDelay={3.1} />
      <FloatingIcon icon={Type} size={18} top="40%" left="20%" animationDelay={0.7} />
      
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          Why You'll ❤️ Our AI Blog Writer
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-50 rounded-full">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section
export const HowItWorks = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const lineProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const stepsAnimate = useAnimation();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          stepsAnimate.start("visible");
        }
      },
      { threshold: 0.3 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [stepsAnimate]);

  const steps = [
    { 
      number: 1, 
      title: "Input Topic", 
      description: "Enter your blog idea", 
      icon: <Pen size={24} /> 
    },
    { 
      number: 2, 
      title: "Choose Style", 
      description: "Set tone, length, keywords", 
      icon: <Zap size={24} /> 
    },
    { 
      number: 3, 
      title: "AI Draft", 
      description: "Watch the draft appear in real time", 
      icon: <Cpu size={24} /> 
    },
    { 
      number: 4, 
      title: "Publish", 
      description: "Export or schedule directly", 
      icon: <Send size={24} /> 
    }
  ];

  const stepVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <section className="py-16 bg-none relative overflow-hidden" ref={ref}>
      {/* Floating Writing Icons */}
      <FloatingIcon icon={Scissors} size={16} top="10%" right="12%" animationDelay={1.2} />
      <FloatingIcon icon={Highlighter} size={20} bottom="20%" left="7%" animationDelay={2.8} />
      {/* <FloatingIcon icon={BookOpen} size={22} top="30%" left="15%" animationDelay={0.5} /> */}
      
      <motion.div 
        className="container mx-auto px-4"
        style={{ opacity }}
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          How It Works
        </motion.h2>
        
        <div className="relative flex justify-between max-w-4xl mx-auto">
          {/* Connector Line */}
          <svg 
            className="absolute top-8 left-0 w-full h-2 z-0" 
            height="2" 
            width="100%"
          >
            <motion.path
              d="M0,1 L100%,1"
              stroke="#ddd"
              strokeWidth="2"
              fill="none"
              style={{ 
                pathLength: lineProgress,
                strokeDasharray: 1,
                strokeDashoffset: 1
              }}
            />
          </svg>
          
          {/* Steps */}
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              className="flex flex-col items-center relative z-10 w-1/4 px-2"
              custom={idx}
              variants={stepVariants}
              initial="hidden"
              animate={stepsAnimate}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-xl font-bold">{step.number}</span>
              </motion.div>
              <motion.div 
                className="bg-white p-3 rounded-lg shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex justify-center mb-2">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-center">{step.title}</h3>
                <p className="text-sm text-center text-gray-600">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Live Demo Section
export const LiveDemo = () => {
  const [typedText, setTypedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const demoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: demoRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  
  const demoText = "Let me create a blog post about artificial intelligence and its impact on content creation. AI tools are revolutionizing how we write by enabling faster production without sacrificing quality...";
  
  useEffect(() => {
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < demoText.length) {
        setTypedText(demoText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowButton(true), 500);
      }
    }, 50);
    
    return () => clearInterval(typeInterval);
  }, []);

  return (
    <section className="py-16 bg-none relative overflow-hidden">
      {/* Floating Writing Icons */}
      <FloatingIcon icon={Text} size={24} top="5%" left="22%" animationDelay={1.8} />
      <FloatingIcon icon={FileSpreadsheet} size={20} top="25%" right="18%" animationDelay={0.9} />
      <FloatingIcon icon={Bot} size={22} bottom="15%" left="28%" animationDelay={2.5} />
      
      <motion.div 
        className="container mx-auto px-4"
        ref={demoRef}
        style={{ opacity, y }}
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          See It In Action
        </motion.h2>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Editor Panel */}
          <div className="w-full md:w-1/2 bg-gray-900 p-6 text-white font-mono">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-gray-400 text-sm">blog-post.md</span>
            </div>
            <div className="h-64 overflow-y-auto">
              <div className="relative">
                {typedText}
                <span className={`inline-block w-2 h-5 bg-white ml-1 ${showButton ? 'opacity-0' : 'animate-pulse'}`}></span>
              </div>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="w-full md:w-1/2 bg-white p-6">
            <div className="flex items-center mb-4">
              <div className="w-full bg-gray-200 h-6 rounded"></div>
            </div>
            <div className="h-64 overflow-y-auto">
              <h3 className="text-xl font-bold mb-3">Artificial Intelligence and Content Creation</h3>
              <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-11/12"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-10/12"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-full"></div>
              <p className="text-gray-700 mb-2">{typedText}</p>
              <div className="h-3 bg-gray-200 rounded mb-2 w-10/12"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-11/12"></div>
            </div>
          </div>
        </motion.div>
        
        {/* Download Button */}
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-purple-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try It Yourself
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Testimonials Section
export const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: testimonialRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  
  const testimonials = [
    {
      avatar: "/people2.jpg",
      name: "Priya Sharma",
      role: "Content Creator",
      quote: "This AI tool has saved me countless hours. I can focus on strategy while it handles the writing. The quality is impressive!"
    },
    {
      avatar: "/people3.jpg",
      name: "Raj Patel",
      role: "Digital Marketer",
      quote: "Our agency churns out 3x more content with consistent quality. The SEO optimization is particularly impressive."
    },
    {
      avatar: "/people1.jpg",
      name: "Ananya Desai",
      role: "Tech Blogger",
      quote: "As someone who writes in both English and Hindi, the AI adapts to regional nuances perfectly. A game-changer for Indian content creators."
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!testimonialRef.current) return;
    
    const { left, top, width, height } = testimonialRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    const avatars = testimonialRef.current.querySelectorAll('.avatar-parallax');
    avatars.forEach((avatar) => {
      if (avatar instanceof HTMLElement) {
        avatar.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
      }
    });
  };

  return (
    <section className="py-16 bg-none relative overflow-hidden">
      {/* Floating Writing Icons */}
      <FloatingIcon icon={PencilRuler} size={18} top="15%" right="10%" animationDelay={1.4} />
      <FloatingIcon icon={AlignLeft} size={22} bottom="25%" left="18%" animationDelay={0.6} />
      
      <div className="absolute inset-0">
        <div className="absolute animate-float-slow opacity-10 w-32 h-32 bg-white rounded-full top-1/4 left-1/4"></div>
        <div className="absolute animate-float opacity-10 w-24 h-24 bg-white rounded-full top-1/3 right-1/3"></div>
        <div className="absolute animate-float-slow opacity-10 w-40 h-40 bg-white rounded-full bottom-1/4 right-1/4"></div>
      </div>
      
      <motion.div 
        className="container mx-auto px-4"
        style={{ opacity, scale }}
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          What Our Users Say
        </motion.h2>
        
        <motion.div 
          ref={testimonialRef}
          className="max-w-4xl mx-auto relative h-80"
          onMouseMove={handleMouseMove}
          whileInView={{ transition: { staggerChildren: 0.1 } }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
                idx === activeSlide 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8 pointer-events-none'
              }`}
              initial={{ opacity: 0, x: 50 }}
              animate={idx === activeSlide ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="bg-white rounded-xl p-8 shadow-md"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex flex-col md:flex-row items-center mb-6">
                  <div className="avatar-parallax mb-4 md:mb-0 md:mr-6 transition-transform duration-100 ease-out">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-purple-100"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-lg text-gray-700 italic">
                  "{testimonial.quote}"
                </blockquote>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Dots navigation */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === activeSlide ? 'bg-purple-600 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Pricing Plans Section
export const PricingPlans = () => {
  const planRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out our AI tools",
      features: [
        "5 AI-generated blog posts/month",
        "Basic grammar checking",
        "1 writing style",
        "Export to plain text"
      ],
      ctaText: "Start Free",
      ctaColor: "bg-gray-600",
      accentColor: "border-gray-200"
    },
    {
      name: "Pro",
      price: "₹499",
      period: "per month",
      description: "For serious content creators",
      features: [
        "50 AI-generated blog posts/month",
        "Advanced grammar & SEO tools",
        "All writing styles",
        "Export to WordPress, Medium",
        "Priority support"
      ],
      ctaText: "Go Pro",
      ctaColor: "bg-teal-600",
      accentColor: "border-teal-200",
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹2999",
      period: "per month",
      description: "For teams and businesses",
      features: [
        "Unlimited AI-generated content",
        "Team collaboration tools",
        "Custom brand voice training",
        "API access",
        "Dedicated account manager"
      ],
      ctaText: "Contact Sales",
      ctaColor: "bg-purple-600",
      accentColor: "border-purple-200"
    }
  ];

  const planVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-16 bg-none relative overflow-hidden" ref={sectionRef}>
      {/* Floating Writing Icons */}
      <FloatingIcon icon={Pen} size={20} top="10%" left="8%" animationDelay={0.5} />
      <FloatingIcon icon={FileText} size={18} bottom="15%" right="10%" animationDelay={1.8} />
      <FloatingIcon icon={Edit} size={22} top="25%" right="20%" animationDelay={1.2} />
      
      <div className="absolute inset-0">
        <div className="absolute animate-float-slow opacity-10 w-32 h-32 bg-white rounded-full top-1/4 left-1/4"></div>
        <div className="absolute animate-float opacity-10 w-24 h-24 bg-white rounded-full top-1/3 right-1/3"></div>
        <div className="absolute animate-float-slow opacity-10 w-40 h-40 bg-white rounded-full bottom-1/4 right-1/4"></div>
      </div>
      
      <motion.div 
        className="container mx-auto px-4"
        style={{ opacity }}
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Choose Your Plan
        </motion.h2>
        <motion.p 
          className="text-center text-gray-200 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Select the perfect package for your content needs. All plans include our core AI technology.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              ref={(el) => (planRefs.current[idx] = el)}
              className={`border-t-4 ${plan.accentColor} rounded-xl shadow-md bg-white p-6 relative ${
                idx === 1 ? 'md:-mt-4 md:mb-4' : ''
              }`}
              custom={idx}
              variants={planVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start">
                    <Check size={18} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button 
                className={`w-full py-3 ${plan.ctaColor} text-white rounded-lg font-medium transition-all duration-300`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">{plan.ctaText}</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "How does the AI writing actually work?",
      answer: "Our AI technology uses advanced natural language processing trained on high-quality content. You provide a topic and preferences, and our AI generates relevant, grammatically correct, and engaging blog posts tailored to your needs."
    },
    {
      question: "Is the content original and plagiarism-free?",
      answer: "Yes! All content generated is 100% original. Our AI creates unique content for each request and doesn't copy existing text. For extra peace of mind, we include a plagiarism checker in our Pro and Enterprise plans."
    },
    {
      question: "Can I edit the AI-generated content?",
      answer: "Absolutely. While our AI creates high-quality drafts, you maintain complete creative control. Our intuitive editor lets you modify, add to, or refine the generated content however you like."
    },
    {
      question: "Does it work in Indian languages besides English?",
      answer: "Yes! We currently support Hindi, Tamil, Bengali, Marathi, and Telugu, with more Indian languages coming soon. Our AI is specifically trained to understand cultural nuances and expressions unique to Indian contexts."
    },
    {
      question: "How do I publish my blog posts?",
      answer: "You can export your finished posts directly to WordPress, Medium, or download them as markdown, HTML, or PDF files. Pro and Enterprise plans include direct integration with most major blogging platforms and CMS systems."
    }
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-none">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                className="w-full flex justify-between items-center p-4 text-left font-semibold focus:outline-none"
                onClick={() => toggleFAQ(idx)}
              >
                {faq.question}
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-300 ${openIndex === idx ? 'transform rotate-180' : ''}`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-60' : 'max-h-0'
                }`}
              >
                <p className="p-4 pt-0 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
export const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-none relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0">
        <div className="absolute animate-float-slow opacity-10 w-32 h-32 bg-white rounded-full top-1/4 left-1/4"></div>
        <div className="absolute animate-float opacity-10 w-24 h-24 bg-white rounded-full top-1/3 right-1/3"></div>
        <div className="absolute animate-float-slow opacity-10 w-40 h-40 bg-white rounded-full bottom-1/4 right-1/4"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Blogging?
          </h2>
          <p className="text-lg mb-8 text-purple-100">
            Join thousands of Indian content creators who are already saving time and creating better content with our AI.
          </p>
          <button className="bg-white text-purple-800 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <span className="relative z-10">Sign Up Free</span>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-purple-100/30 to-white/0 -translate-x-full group-hover:animate-wave"></div>
          </button>
          <p className="mt-4 text-purple-200 text-sm">
            No credit card required • Free plan available
          </p>
        </div>
      </div>
    </section>
  );
};

