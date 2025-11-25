import { useMemo } from 'react';
import { useParticipants } from '../hooks/useParticipants';
import { formatScore } from '../lib/utils';

export function Scoreboard() {
  const { participants, loading } = useParticipants();

  // Memoize the participant data to prevent unnecessary re-renders
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => b.total_score - a.total_score);
  }, [participants]);

  return (
    <div className="h-screen bg-gradient-to-br from-[#1a1a40] via-[#2a0a5e] to-[#1a1a40] flex overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="w-48 flex-col items-center justify-center p-4 flex-shrink-0 border-r border-purple-700/30 hidden md:flex">
        <p className="text-white text-xs uppercase tracking-widest opacity-70 mb-4 text-center">
          CP MOIDEEN HAJI MEMORIAL
        </p>

        <div className="flex items-center justify-center mb-4">
          <img
            src="/Untitled-1 (1).png"
            alt="Mr Talent Logo"
            className="h-24 w-auto object-contain"
          />
        </div>

        <p className="text-white text-xs uppercase tracking-widest opacity-80 text-center">
          SEASON 02
        </p>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Mobile header with logo */}
        <div className="md:hidden flex flex-col items-center mb-3">
          <div className="flex items-center justify-center mb-2">
            <img
              src="/Untitled-1 (1).png"
              alt="Mr Talent Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-white text-xs uppercase tracking-widest opacity-70 mb-1">
              CP MOIDEEN HAJI MEMORIAL
            </p>
            <p className="text-white text-xs uppercase tracking-widest opacity-80">
              SEASON 02
            </p>
          </div>
        </div>

        {/* Header with mobile-friendly title */}
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest text-center mb-3 flex-shrink-0">
          Scoreboard
        </h2>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white text-lg opacity-70">Loading scoreboard...</p>
          </div>
        ) : (
          // Added horizontal scrolling for mobile
          <div className="flex-1 overflow-x-auto rounded-lg shadow-2xl min-h-0">
            <table className="w-full text-white text-sm min-w-[700px] md:min-w-0">
              <thead className="sticky top-0">
                <tr className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-sm">
                  <th className="px-2 py-2 text-center uppercase tracking-wide font-bold border-r border-purple-700/50 whitespace-nowrap w-[40px]">Rank</th>
                  <th className="px-2 py-2 text-left uppercase tracking-wide font-bold border-r border-purple-700/50 whitespace-nowrap min-w-[120px]">Candidate</th>
                  <th className="px-2 py-2 text-left uppercase tracking-wide font-bold border-r border-purple-700/50 hidden md:table-cell min-w-[120px]">College</th>
                  <th className="px-1 py-2 text-center uppercase tracking-wide font-bold border-r border-purple-700/50 whitespace-nowrap w-[40px]">R1</th>
                  <th className="px-1 py-2 text-center uppercase tracking-wide font-bold border-r border-purple-700/50 whitespace-nowrap w-[40px]">R2</th>
                  <th className="px-1 py-2 text-center uppercase tracking-wide font-bold border-r border-purple-700/50 whitespace-nowrap w-[40px]">R3</th>
                  <th className="px-1 py-2 text-center uppercase tracking-wide font-bold border-r border-purple-700/50 whitespace-nowrap w-[40px]">R4</th>
                  <th className="px-1 py-2 text-center uppercase tracking-wide font-bold border-r border-purple-700/50 whitespace-nowrap w-[40px]">R5</th>
                  <th className="px-2 py-2 text-center uppercase tracking-wide font-bold bg-gradient-to-r from-indigo-600 to-purple-600 whitespace-nowrap w-[60px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedParticipants.map((participant, index) => {
                  const isEven = index % 2 === 0;
                  const bgClass = isEven ? 'bg-purple-900/40' : 'bg-indigo-950/40';
                  return (
                    <tr
                      key={participant.id}
                      className={`${bgClass} hover:bg-purple-800/30 transition-colors border-b border-purple-800/30`}
                    >
                      <td className="px-2 py-1.5 text-center font-bold border-r border-purple-700/30">
                        {participant.rank}
                      </td>
                      <td className="px-2 py-1.5 font-medium border-r border-purple-700/30">
                        <div className="flex flex-col">
                          <span className="whitespace-nowrap">{participant.name}</span>
                          {/* Show college on mobile as a separate line */}
                          <span className="text-gray-300 text-xs md:hidden">{participant.college}</span>
                        </div>
                      </td>
                      <td className="px-2 py-1.5 border-r border-purple-700/30 text-gray-300 hidden md:table-cell">
                        {participant.college}
                      </td>
                      <td className="px-1 py-1.5 text-center border-r border-purple-700/30">
                        {formatScore(participant.round1)}
                      </td>
                      <td className="px-1 py-1.5 text-center border-r border-purple-700/30">
                        {formatScore(participant.round2)}
                      </td>
                      <td className="px-1 py-1.5 text-center border-r border-purple-700/30">
                        {formatScore(participant.round3)}
                      </td>
                      <td className="px-1 py-1.5 text-center border-r border-purple-700/30">
                        {formatScore(participant.round4)}
                      </td>
                      <td className="px-1 py-1.5 text-center border-r border-purple-700/30">
                        {formatScore(participant.round5)}
                      </td>
                      <td className="px-2 py-1.5 text-center bg-gradient-to-r from-indigo-600/60 to-purple-600/60">
                        <span className="inline-block bg-white/10 px-2 py-1 rounded-full font-bold text-sm backdrop-blur-sm">
                          {formatScore(participant.total_score)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}