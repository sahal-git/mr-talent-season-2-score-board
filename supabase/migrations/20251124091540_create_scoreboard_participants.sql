/*
  # Create scoreboard participants table

  1. New Tables
    - `scoreboard_participants`
      - `id` (uuid, primary key)
      - `rank` (integer)
      - `name` (text)
      - `college` (text)
      - `round1` (numeric)
      - `round2` (numeric)
      - `round3` (numeric)
      - `round4` (numeric)
      - `round5` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `scoreboard_participants` table
    - Add policy for public read access
    - Add policy for authenticated admin updates
*/

CREATE TABLE IF NOT EXISTS scoreboard_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rank integer NOT NULL,
  name text NOT NULL,
  college text NOT NULL,
  round1 numeric(4,2) NOT NULL DEFAULT 0,
  round2 numeric(4,2) NOT NULL DEFAULT 0,
  round3 numeric(4,2) NOT NULL DEFAULT 0,
  round4 numeric(4,2) NOT NULL DEFAULT 0,
  round5 numeric(4,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scoreboard_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON scoreboard_participants
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert"
  ON scoreboard_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update"
  ON scoreboard_participants
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete"
  ON scoreboard_participants
  FOR DELETE
  TO authenticated
  USING (true);
