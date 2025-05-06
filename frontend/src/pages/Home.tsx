import React from 'react';
import Hero from '../components/Hero';
import { 
  KeyFeatures, 
  HowItWorks, 
  LiveDemo, 
  Testimonials, 
  PricingPlans, 
  FAQ, 
  CTASection, 
} from '../components/HomePageSections';
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-none">
      <Hero />
      <KeyFeatures />
      <HowItWorks />
      <LiveDemo />
      <Testimonials />
      <PricingPlans />
      <FAQ />
      <CTASection />
    </div>
  );
};

export default Home;