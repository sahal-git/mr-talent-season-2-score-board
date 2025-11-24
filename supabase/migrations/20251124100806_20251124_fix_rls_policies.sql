/*
  # Fix RLS policies for public insert access

  1. Changes
    - Update INSERT policy to allow public access (unauthenticated users can add participants)
    - Keep READ policy for public access
    - Allow UPDATE and DELETE for public use
*/

DROP POLICY IF EXISTS "Authenticated users can insert" ON scoreboard_participants;
DROP POLICY IF EXISTS "Authenticated users can update" ON scoreboard_participants;
DROP POLICY IF EXISTS "Authenticated users can delete" ON scoreboard_participants;

CREATE POLICY "Public can insert"
  ON scoreboard_participants
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update"
  ON scoreboard_participants
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete"
  ON scoreboard_participants
  FOR DELETE
  TO public
  USING (true);