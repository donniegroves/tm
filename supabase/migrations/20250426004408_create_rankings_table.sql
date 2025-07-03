CREATE TABLE
    public.rankings (
        question_id integer NOT NULL REFERENCES public.questions (id) ON DELETE CASCADE,
        game_id integer NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        ranking jsonb NOT NULL,
        created_at timestamp
        with
            time zone DEFAULT now (),
            updated_at timestamp
        with
            time zone DEFAULT now (),
            PRIMARY KEY (question_id, game_id, user_id)
    );

-- Enable Row Level Security
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;