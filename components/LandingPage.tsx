'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, Clock, Database, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

const DynamicParticleBackground = dynamic(() => import('./ParticleBackground'), { 
  ssr: false,
  loading: () => null
});

const useCases = [
  {
    emoji: '🍕',
    title: "We can't agree on dinner (again)",
    description: "Turn daily decisions into easy conversations"
  },
  {
    emoji: '🏠',
    title: "Big decision, different opinions",
    description: "Navigate life's major choices together"
  },
  {
    emoji: '👥',
    title: "Team can't get aligned",
    description: "Get everyone on the same page"
  },
  {
    emoji: '🎯',
    title: "Need to make a call together",
    description: "Find clarity when stakes are high"
  }
];

const trustIndicators = [
  { icon: Shield, text: "End-to-end encrypted" },
  { icon: Clock, text: "Auto-deletes" },
  { icon: Database, text: "No data stored" }
];

export default function LandingPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartConversation = () => {
    router.push('/prep');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Dynamic background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%)'
        }}
      />

      {/* Animated background overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ y }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Particle background */}
      <DynamicParticleBackground currentSpeaker="user" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating glass morphism background */}
            <motion.div
              className="absolute inset-0 glass-morphism-dark rounded-3xl opacity-20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                transform: 'translate(-10%, -10%)',
                width: '120%',
                height: '120%',
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Main headline with gradient text */}
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                A safe space that's actually safe
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                When you're stuck in your corners. From dinner table debates to big life decisions. 
                Lumunus gives every conversation a fresh start.
              </motion.p>

              {/* Primary CTA */}
              <motion.button
                onClick={handleStartConversation}
                className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-2xl text-lg transition-all duration-300 flex items-center gap-3 mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 40px rgba(20, 184, 166, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Start a Conversation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What brings you here?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism-dark rounded-2xl p-6 cursor-pointer group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
                  }}
                  onClick={handleStartConversation}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {useCase.emoji}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {useCase.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Two sides. One space. Zero memory.
            </motion.h2>

            <motion.div
              className="glass-morphism-dark rounded-3xl p-8 md:p-12 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-6">
                Not therapy. Not mediation. Just a neutral space where two people can actually hear each other. 
                Take turns, speak freely, find your own way forward.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-gray-300">
                <span>And when you're done?</span>
                <motion.span
                  className="font-bold text-teal-400 relative"
                  whileHover={{ scale: 1.1 }}
                >
                  Poof.
                  {/* Poof particle effect */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-teal-300" />
                  </motion.div>
                </motion.span>
                <span>The whole conversation vanishes.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Secondary CTA */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Ready to start? Begin your conversation
              </h3>
              <motion.button
                onClick={handleStartConversation}
                className="group px-8 py-4 glass-morphism-dark border-teal-400/50 text-teal-400 hover:text-white hover:bg-teal-500/20 font-semibold rounded-2xl text-lg transition-all duration-300 flex items-center gap-3 mx-auto"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(20, 184, 166, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-400">
                  <indicator.icon size={18} className="text-teal-400" />
                  <span className="text-sm">{indicator.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Simple footer */}
            <motion.div
              className="border-t border-white/10 pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center gap-8 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}