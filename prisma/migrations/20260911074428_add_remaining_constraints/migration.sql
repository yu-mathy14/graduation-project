ALTER TABLE "players"
ADD CONSTRAINT "players_jersey_number_check"
CHECK ("jersey_number" > 0);

ALTER TABLE "players"
ADD CONSTRAINT "players_height_check"
CHECK ("height" > 50);

ALTER TABLE "players"
ADD CONSTRAINT "players_weight_check"
CHECK ("weight" > 3);

ALTER TABLE "games"
ADD CONSTRAINT "games_home_away_team_check"
CHECK ("home_team_id" <> "away_team_id");