import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useParticipants } from '../hooks/useParticipants';

export function CinematicChart() {
  const { participants: allParticipants, loading } = useParticipants();
  const [currentParticipant, setCurrentParticipant] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Get participants sorted by score (highest first) and take the top 6
  const participantsSortedByScore = [...allParticipants]
    .sort((a, b) => b.total_score - a.total_score);
  
  const topSix = participantsSortedByScore.slice(0, 6);
  
  // For reveal order (lowest score first, so we reverse)
  const participantsForReveal = [...topSix].reverse();

  // Reset animation
  const resetAnimation = () => {
    setCurrentParticipant(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowAll(false);
  };

  // Handle the reveal sequence
  useEffect(() => {
    if (!isPlaying || loading) return;

    if (currentStep < participantsForReveal.length) {
      // Show current participant
      setCurrentParticipant(participantsForReveal[currentStep].id);
      
      // After 3 seconds, hide and move to next
      const hideTimer = setTimeout(() => {
        setCurrentParticipant(null);
        
        // Move to next participant or show all
        const nextTimer = setTimeout(() => {
          if (currentStep < participantsForReveal.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            // After last participant, show all
            setShowAll(true);
          }
        }, 1000); // 1 second gap before next
        
        return () => clearTimeout(nextTimer);
      }, 3000); // 3 seconds for each participant
      
      return () => clearTimeout(hideTimer);
    }
  }, [isPlaying, currentStep, participantsForReveal, loading]);

  // Start the animation
  const startAnimation = () => {
    if (participantsForReveal.length === 0) return;
    setIsPlaying(true);
    setCurrentParticipant(null);
    setCurrentStep(0);
    setShowAll(false);
  };

  // Calculate max score for bar height normalization (use max of top six)
  const maxScore = topSix.length > 0 
    ? Math.max(...topSix.map(p => p.total_score)) 
    : 100;
  
  // Calculate min score for better visualization
  const minScore = topSix.length > 0 
    ? Math.min(...topSix.map(p => p.total_score)) 
    : 0;

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-[#0a0a20] via-[#1a0a3e] to-[#0a0a20] flex items-center justify-center">
        <p className="text-white text-xl">Loading participant data...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#0a0a20] via-[#1a0a3e] to-[#0a0a20] p-4 md:p-8 overflow-hidden relative">
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [0, -20, -40],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Mist effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none"></div>

      {/* Volumetric light */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="h-full flex flex-col relative z-10">
        {/* Header with animated title */}
        <div className="mb-6 text-center relative">
          <AnimatePresence>
            {showAll && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="text-2xl md:text-4xl font-bold text-white uppercase tracking-widest"
              >
                <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Final Short-list
                </span>
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-slate-900/20 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
          {!isPlaying && !showAll ? (
            <div className="h-full flex flex-col items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startAnimation}
                disabled={participantsForReveal.length === 0}
                className={`flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold transition-all shadow-lg ${
                  participantsForReveal.length === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white'
                }`}
              >
                <Sparkles className="w-8 h-8" />
                Start Cinematic Reveal
              </motion.button>
              
              {participantsForReveal.length === 0 ? (
                <p className="text-gray-400 mt-6 text-center text-lg">
                  No participant data available
                </p>
              ) : (
                <p className="text-gray-400 mt-6 text-center text-lg">
                  Reveal the top 6 participants
                </p>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetAnimation}
                className="mt-8 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Reset Animation
              </motion.button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Chart area */}
              <div className="flex-1 flex items-end justify-center gap-8 md:gap-12 relative">
                {participantsForReveal.map((participant, index) => {
                  const isVisible = currentParticipant === participant.id || showAll;
                  const isLast = index === participantsForReveal.length - 1; // Highest scorer (originally lowest in top 6)
                  
                  // Calculate bar height with a minimum to ensure visibility
                  const barHeightPercentage = topSix.length > 0 
                    ? ((participant.total_score - minScore) / Math.max(1, maxScore - minScore)) * 70 + 10
                    : 10;
                  
                  return (
                    <div key={participant.id} className="flex flex-col items-center relative h-full">
                      {/* Spotlight effect for revealed bars */}
                      <AnimatePresence>
                        {isVisible && (
                          <motion.div
                            className="absolute -top-20 -bottom-4 -left-8 -right-8"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: [0, 0.3, 0],
                              x: [-50, 50, 100],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 1.5,
                              delay: 0.2,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent blur-xl"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Bar container */}
                      <div className="relative flex flex-col items-center w-16 md:w-20 h-full">
                        {/* Score label */}
                        <div className="h-12 flex items-center justify-center mb-2 relative z-10">
                          <AnimatePresence>
                            {isVisible && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ 
                                  opacity: 1, 
                                  scale: [0.5, 1.2, 1],
                                }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ 
                                  duration: 0.8,
                                  delay: 0.3,
                                }}
                                className={`font-bold text-lg ${
                                  isLast && showAll
                                    ? "text-yellow-300 text-2xl drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" 
                                    : "text-white"
                                }`}
                              >
                                {participant.total_score}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Bar */}
                        <div className="relative w-full flex-1 flex items-end">
                          <AnimatePresence>
                            {isVisible && (
                              <motion.div
                                initial={{ height: "0%" }}
                                animate={{ 
                                  height: `${barHeightPercentage}%`,
                                }}
                                exit={{ height: "0%" }}
                                transition={{ 
                                  duration: 1.5,
                                  ease: "easeOut",
                                  delay: 0.2,
                                }}
                                className={`
                                  w-full rounded-t-lg relative overflow-hidden
                                  ${isLast && showAll
                                    ? "bg-gradient-to-t from-yellow-500 to-yellow-300 shadow-[0_0_20px_rgba(255,215,0,0.6)]" 
                                    : "bg-gradient-to-t from-purple-600 to-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                  }
                                `}
                              >
                                {/* Particle burst on reveal */}
                                <AnimatePresence>
                                  {isVisible && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ delay: 0.5 }}
                                      className="absolute inset-0"
                                    >
                                      {[...Array(5)].map((_, i) => (
                                        <motion.div
                                          key={i}
                                          className="absolute w-1 h-1 bg-white rounded-full"
                                          initial={{ 
                                            x: '50%',
                                            y: '100%',
                                            opacity: 1,
                                          }}
                                          animate={{ 
                                            x: `${Math.random() * 100}%`,
                                            y: `${Math.random() * -100}%`,
                                            opacity: 0,
                                        }}
                                          exit={{ opacity: 0 }}
                                          transition={{ 
                                            duration: 1,
                                            delay: 0.5 + Math.random() * 0.5,
                                          }}
                                        />
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                
                                {/* Golden shimmer for last participant */}
                                <AnimatePresence>
                                  {isLast && showAll && (
                                    <motion.div
                                      initial={{ x: '-100%' }}
                                      animate={{ x: '200%' }}
                                      exit={{ x: '200%' }}
                                      transition={{ 
                                        duration: 2,
                                        delay: 1,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                      }}
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/40 to-transparent"
                                    />
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Participant label */}
                        <div className="mt-4 h-8 flex items-center z-10">
                          <AnimatePresence>
                            {isVisible && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ 
                                  duration: 0.8,
                                  delay: 0.5,
                                }}
                                className={`font-bold ${
                                  isLast && showAll
                                    ? "text-yellow-300 drop-shadow-[0_0_4px_rgba(255,215,0,0.8)]" 
                                    : "text-purple-300"
                                }`}
                              >
                                {participant.name}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress indicator */}
              <div className="flex justify-center gap-3 mt-8">
                {participantsForReveal.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep || showAll
                        ? "bg-purple-500" 
                        : "bg-gray-700"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: (index <= currentStep || showAll) ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back button */}
        {(isPlaying || showAll) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetAnimation}
            className="fixed top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all z-50 shadow-lg shadow-purple-500/30"
          >
            Reset
          </motion.button>
        )}
      </div>
    </div>
  );
}