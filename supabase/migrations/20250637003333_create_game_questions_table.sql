CREATE TABLE
    public.game_questions (
        game_id integer NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
        round integer NOT NULL CHECK (round >= 1 AND round <= 5),
        question_id integer NOT NULL REFERENCES public.questions (id) ON DELETE CASCADE,
        created_at timestamp
        with
            time zone DEFAULT now (),
            updated_at timestamp
        with
            time zone DEFAULT now (),
            PRIMARY KEY (game_id, round, question_id)
    );

-- Enable Row Level Security
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert questions for games they host
ALTER POLICY "Users can insert questions for games they host"
ON public.game_questions
TO authenticated
WITH CHECK (
    game_id IN (
        SELECT game_users.game_id
        FROM game_users
        WHERE
            game_users.user_id = (SELECT auth.uid())
            AND game_users.is_host = true
    )
);

-- Policy: Users can select rows of games they are affiliated with
ALTER POLICY "Users can select rows of games they are affiliated with"
ON public.game_questions
TO authenticated
USING (
    game_id IN (
        SELECT game_users.game_id
        FROM game_users
        WHERE game_users.user_id = (SELECT auth.uid())
    )
);

-- Policy: Hosts can remove questions from games they host
ALTER POLICY "Hosts can remove questions from games"
ON public.game_questions
TO authenticated
USING (
    game_id IN (
        SELECT game_users.game_id
        FROM game_users
        WHERE
            game_users.user_id = (SELECT auth.uid())
            AND game_users.is_host = true
    )
);
