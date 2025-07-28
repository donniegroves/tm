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
