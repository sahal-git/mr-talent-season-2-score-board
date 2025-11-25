import { useState, useEffect } from 'react';
import { supabase, Participant, ParticipantInput } from '../lib/supabase';

// Helper function to calculate total score
const calculateTotalScore = (participant: Partial<Participant>): number => {
  return (
    (participant.round1 || 0) +
    (participant.round2 || 0) +
    (participant.round3 || 0) +
    (participant.round4 || 0) +
    (participant.round5 || 0)
  );
};

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('scoreboard_participants')
        .select('*')
        .order('total_score', { ascending: false });

      if (err) throw err;

      const participantsWithRank = (data || []).map((p, index) => ({
        ...p,
        rank: index + 1,
      }));

      setParticipants(participantsWithRank);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();

    const channel = supabase
      .channel('scoreboard_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scoreboard_participants'
        },
        (payload) => {
          // Add the new participant and re-sort
          const newParticipantData = payload.new as Participant;
          const newParticipant = {
            ...newParticipantData,
            total_score: calculateTotalScore(newParticipantData),
            rank: 0 // Will be recalculated
          };
          
          setParticipants(prev => {
            const updated = [...prev, newParticipant];
            // Sort by total_score descending
            updated.sort((a, b) => b.total_score - a.total_score);
            // Recalculate ranks
            return updated.map((p, index) => ({
              ...p,
              rank: index + 1
            }));
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scoreboard_participants'
        },
        (payload) => {
          // Update the participant and re-sort
          const updatedParticipantData = payload.new as Participant;
          const updatedParticipant = {
            ...updatedParticipantData,
            total_score: calculateTotalScore(updatedParticipantData)
          };
          
          setParticipants(prev => {
            const updated = prev.map(p => 
              p.id === updatedParticipant.id ? updatedParticipant : p
            );
            // Sort by total_score descending
            updated.sort((a, b) => b.total_score - a.total_score);
            // Recalculate ranks
            return updated.map((p, index) => ({
              ...p,
              rank: index + 1
            }));
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'scoreboard_participants'
        },
        (payload) => {
          // Remove the participant and re-sort
          setParticipants(prev => {
            const updated = prev.filter(p => p.id !== payload.old.id);
            // Recalculate ranks
            return updated.map((p, index) => ({
              ...p,
              rank: index + 1
            }));
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addParticipant = async (data: ParticipantInput) => {
    try {
      const { error: err } = await supabase
        .from('scoreboard_participants')
        .insert([data]);

      if (err) throw err;
      // No need to manually refetch - real-time subscription will handle it
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add participant');
      return false;
    }
  };

  const updateParticipant = async (id: string, data: Partial<ParticipantInput>) => {
    try {
      const { error: err } = await supabase
        .from('scoreboard_participants')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (err) throw err;
      // No need to manually refetch - real-time subscription will handle it
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update participant');
      return false;
    }
  };

  const deleteParticipant = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('scoreboard_participants')
        .delete()
        .eq('id', id);

      if (err) throw err;
      // No need to manually refetch - real-time subscription will handle it
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete participant');
      return false;
    }
  };

  return {
    participants,
    loading,
    error,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    refetch: fetchParticipants,
  };
}