/*
  # Add auto-rank calculation

  1. Changes
    - Modify `scoreboard_participants` to include a generated rank column
    - Rank will be auto-calculated based on total score (sum of all rounds) in descending order
    - Remove the need to manually enter rank
*/

ALTER TABLE scoreboard_participants
ADD COLUMN total_score numeric(6,2) GENERATED ALWAYS AS (round1 + round2 + round3 + round4 + round5) STORED;

CREATE INDEX idx_scoreboard_total_score ON scoreboard_participants(total_score DESC);