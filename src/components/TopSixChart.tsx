import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useParticipants } from '../hooks/useParticipants';
import { Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TopSixChart() {
  const { participants, loading } = useParticipants();
  const [revealedParticipants, setRevealedParticipants] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [introNames, setIntroNames] = useState<string[]>([]);
  const [animations, setAnimations] = useState<{[key: string]: boolean}>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Get top 6 participants (in reverse order for reveal)
  const topSix = participants.slice(0, 6);
  const reversedTopSix = [...topSix].reverse();

  // Format data for the chart (only total scores)
  const chartData = reversedTopSix.map(participant => ({
    name: participant.name,
    total: participant.total_score,
  }));

  // Reset when participants change
  useEffect(() => {
    setRevealedParticipants([]);
    setIsPlaying(false);
    setCurrentIndex(0);
    setShowIntro(true);
    setAnimations({});
  }, [participants]);

  // Handle intro animation
  useEffect(() => {
    if (!showIntro || participants.length === 0) return;

    // Shuffle participant names for intro
    const shuffledNames = [...participants]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15)
      .map(p => p.name);
    
    setIntroNames(shuffledNames);

    // After 4 seconds, hide intro and show play button
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [showIntro, participants]);

  // Handle the reveal animation
  useEffect(() => {
    if (!isPlaying || currentIndex >= chartData.length) return;

    const timer = setTimeout(() => {
      // Add the participant at the current index (6th, then 5th, etc.)
      setRevealedParticipants(prev => {
        const newParticipants = [...prev, chartData[currentIndex]];
        return newParticipants;
      });
      
      // Trigger animations for this participant
      setAnimations(prev => ({
        ...prev,
        [currentIndex]: true
      }));
      
      setCurrentIndex(prev => prev + 1);
    }, 3000); // 3 seconds delay for cinematic effect

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, chartData]);

  const handlePlay = () => {
    if (chartData.length > 0) {
      setIsPlaying(true);
      setCurrentIndex(0);
      setRevealedParticipants([]);
      setAnimations({});
    }
  };

  // Particle effect component
  const ParticleEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-[#0a0a20] via-[#1a0a3e] to-[#0a0a20] flex items-center justify-center relative overflow-hidden">
        <ParticleEffect />
        <p className="text-white text-lg opacity-70 z-10">Loading chart...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen bg-gradient-to-br from-[#0a0a20] via-[#1a0a3e] to-[#0a0a20] p-4 md:p-8 overflow-hidden relative"
    >
      <ParticleEffect />
      
      <div className="h-full flex flex-col relative z-10">
        {/* Header with animated title */}
        <div className="mb-6 text-center relative">
          <h2 
            className={`text-2xl md:text-4xl font-bold text-white uppercase tracking-widest transition-all duration-1000 ${
              revealedParticipants.length === 6 ? 'animate-pulse text-yellow-300' : ''
            }`}
          >
            Final Short-list
          </h2>
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-slate-900/20 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm relative overflow-hidden">
          {showIntro ? (
            <div className="h-full flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold text-white mb-8 animate-pulse">Contestants</h3>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                {introNames.map((name, index) => (
                  <div 
                    key={index}
                    className="px-4 py-3 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 text-white rounded-lg animate-bounce shadow-lg shadow-purple-500/20"
                    style={{ 
                      animationDelay: `${index * 0.15}s`,
                      animationDuration: '2s'
                    }}
                  >
                    <span className="font-bold">{name}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 mt-12 text-center text-lg animate-pulse">
                Preparing results...
              </p>
            </div>
          ) : !isPlaying ? (
            <div className="h-full flex flex-col items-center justify-center">
              <button
                onClick={handlePlay}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                <Play className="w-8 h-8" />
                Reveal Results
              </button>
              <p className="text-gray-400 mt-6 text-center text-lg">
                Experience the cinematic reveal
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revealedParticipants}
                    margin={{
                      top: 60,
                      right: 30,
                      left: 20,
                      bottom: 80,
                    }}
                    className="animate-fade-in"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4f46e5" opacity={0.4} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                      tick={{ fill: '#e0e7ff', fontSize: 14, fontWeight: 'bold' }}
                    />
                    <YAxis 
                      tick={{ fill: '#c7d2fe' }} 
                      domain={[0, 'dataMax + 10']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e1b4b', 
                        borderColor: '#8b5cf6',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
                      }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#e0e7ff', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="total" 
                      name="Total Score" 
                      fill="#7e22ce" 
                      animationDuration={2000}
                      animationEasing="ease-out"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList 
                        dataKey="name" 
                        position="top" 
                        fill="#ffffff" 
                        fontSize={18} 
                        fontWeight="bold" 
                        className="drop-shadow-lg"
                      />
                      <LabelList 
                        dataKey="total" 
                        position="center" 
                        fill="#ffffff" 
                        fontSize={24} 
                        fontWeight="bold" 
                        className="drop-shadow-lg"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Animation indicators for each reveal */}
              <div className="flex justify-center gap-4 mt-4">
                {chartData.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      index < revealedParticipants.length 
                        ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/50' 
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isPlaying && (
          <div className="mt-4 text-center text-gray-400 text-sm">
            <p>Revealing participants: {revealedParticipants.length}/6</p>
          </div>
        )}
        
        {(isPlaying || !showIntro) && (
          <Link 
            to="/" 
            className="fixed top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all z-50 shadow-lg shadow-purple-500/30"
          >
            Back to Scoreboard
          </Link>
        )}
      </div>
    </div>
  );
}