/*
  # Make rank column nullable

  1. Changes
    - Alter rank column to be nullable
    - Rank will be calculated client-side based on total score ordering
*/

ALTER TABLE scoreboard_participants
ALTER COLUMN rank DROP NOT NULL;