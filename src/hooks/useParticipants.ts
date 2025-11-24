import { useState, useEffect } from 'react';
import { supabase, Participant, ParticipantInput } from '../lib/supabase';

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
          event: '*',
          schema: 'public',
          table: 'scoreboard_participants'
        },
        () => {
          fetchParticipants();
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
      await fetchParticipants();
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
      await fetchParticipants();
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
      await fetchParticipants();
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
