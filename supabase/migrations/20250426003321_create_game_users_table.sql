CREATE TABLE
    public.game_users (
        game_id integer NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        is_host boolean NOT NULL DEFAULT false,
        created_at timestamp
        with
            time zone DEFAULT now (),
            updated_at timestamp
        with
            time zone DEFAULT now (),
            PRIMARY KEY (game_id, user_id)
    );

-- Enable Row Level Security
ALTER TABLE public.game_users ENABLE ROW LEVEL SECURITY;

CREATE VIEW view_game_users AS
SELECT gu.*
FROM game_users gu
WHERE EXISTS (
  SELECT 1
  FROM game_users gu2
  WHERE gu2.user_id = auth.uid()
    AND gu2.game_id = gu.game_id
);

CREATE VIEW view_users AS
SELECT DISTINCT
  u.*
FROM users u
WHERE 
  -- Users can always see their own row
  u.user_id = auth.uid()
  OR
  -- Admin users (access_level = 2) can see all users
  (SELECT access_level FROM users WHERE user_id = auth.uid()) = 2
  OR
  -- Normal users can only see users they share games with
  EXISTS (
    SELECT 1
    FROM game_users gu1
    INNER JOIN game_users gu2 ON gu1.game_id = gu2.game_id
    WHERE gu1.user_id = auth.uid()
      AND gu2.user_id = u.user_id
  );

-- Add comment to explain the view
COMMENT ON VIEW view_users IS 'Shows user details (excluding access_level). Users can always see their own row, admins (access_level = 2) can see all users, and normal users can see users they share games with';