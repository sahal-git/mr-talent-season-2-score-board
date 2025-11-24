import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Participant {
  id: string;
  rank: number;
  name: string;
  college: string;
  round1: number;
  round2: number;
  round3: number;
  round4: number;
  round5: number;
  total_score: number;
  created_at: string;
  updated_at: string;
}

export type ParticipantInput = Omit<Participant, 'id' | 'rank' | 'total_score' | 'created_at' | 'updated_at'>;
