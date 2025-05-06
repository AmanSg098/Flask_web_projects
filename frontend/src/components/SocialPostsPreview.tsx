import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SocialPostsPreview: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Create scroll-driven transforms with more subtle ranges
  // Card 1 - Left side card
const card1X = useTransform(scrollY, [0, 200], [8, -120]);  // Increased horizontal travel
const card1Y = useTransform(scrollY, [0, 200], [-6, -40]);
const card1Rotate = useTransform(scrollY, [0, 200], [12, 18]);
const card1Opacity = useTransform(scrollY, [0, 100, 300], [1, 0.9, 1]);  // Never goes below 0.9

// Card 2 - Right side card
const card2X = useTransform(scrollY, [0, 200], [-12, 120]);  // Increased horizontal travel
const card2Y = useTransform(scrollY, [0, 200], [8, 40]);
const card2Rotate = useTransform(scrollY, [0, 200], [-6, -12]);
const card2Opacity = useTransform(scrollY, [0, 100, 300], [1, 0.9, 1]);  // Never goes below 0.9

// Card 3 - Center card
const card3Y = useTransform(scrollY, [0, 200], [0, 40]);
const card3Rotate = useTransform(scrollY, [0, 300], [3, 12]);
const card3Scale = useTransform(scrollY, [0, 200], [1, 0.9]);
const card3Opacity = useTransform(scrollY, [0, 100, 300], [1, 0.95, 1]); // Never goes below 0.8

  return (
    <div className="relative w-full h-96 flex items-center justify-center z-20">
      {/* First card - gradually moves left and up */}
      <motion.div 
        className="absolute bg-white rounded-lg shadow-lg p-4 w-64 z-10"
        style={{ 
          x: card1X,
          y: card1Y,
          rotate: card1Rotate,
          opacity: card1Opacity
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="flex items-center mb-2">
          <img src="/people2.jpg" alt="User" className="w-8 h-8 rounded-full object-cover" />
          <div className="ml-2">
            <div className="text-sm font-bold">@richard</div>
            <div className="text-xs text-gray-500">@richard</div>
          </div>
        </div>
        <img src="/post1.jpg" alt="Post" className="w-full h-32 object-cover rounded-lg mb-2" />
        <div className="text-xs text-gray-800">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
        </div>
        <div className="mt-2 text-xs text-gray-500">10:15 AM · 8/2/21</div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <div>26.1k Retweets</div>
          <div className="flex">
            <span className="mr-2">❤️</span> 2,289
          </div>
        </div>
      </motion.div>
      
      {/* Second card - gradually moves right and down */}
      <motion.div 
        className="absolute bg-white rounded-lg shadow-lg p-4 w-64 z-20"
        style={{ 
          x: card2X,
          y: card2Y,
          rotate: card2Rotate,
          opacity: card2Opacity
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="flex items-center mb-2">
          <img src="/people3.jpg" alt="User" className="w-8 h-8 rounded-full object-cover" />
          <div className="ml-2">
            <div className="text-sm font-bold">Sam</div>
            <div className="text-xs text-gray-500">@SamParker</div>
          </div>
        </div>
        <img src="/post2.png" alt="Post" className="w-full h-32 object-cover rounded-lg mb-2" />
        <div className="text-xs text-gray-800">
          Parents don't care how the picture looks, they just post you! 💛
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <div>❤️ Likes</div>
          <div>💬 Comments</div>
        </div>
      </motion.div>
      
      {/* Third card - gradually moves down and scales slightly */}
      <motion.div 
        className="absolute bg-white rounded-lg shadow-lg p-4 w-64 z-30"
        style={{ 
          y: card3Y,
          rotate: card3Rotate,
          scale: card3Scale,
          opacity: card3Opacity
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="flex items-center mb-2">
          <img src="/people1.jpg" alt="User" className="w-8 h-8 rounded-full object-cover" />
          <div className="ml-2">
            <div className="text-sm font-bold">Natasha</div>
            <div className="text-xs text-gray-500">@natasha002</div>
          </div>
        </div>
        <img src="/post3.jpg" alt="Post" className="w-full h-32 object-cover rounded-lg mb-2" />
        <div className="text-xs text-gray-800">
          "This masterpiece receives specially high praise on Amazon - just look at that rating! Oooooh has come out with illustrations of Latin Jihad, but this OG strange tales is my forever favorite." -@Writer
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <div>💬 10k</div>
          <div>🔄 55k</div>
          <div>❤️ Likes</div>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialPostsPreview;