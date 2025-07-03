CREATE TABLE
    public.pre_answers (
        id serial PRIMARY KEY,
        question_id integer NOT NULL REFERENCES public.questions (id) ON DELETE CASCADE,
        game_id integer NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        answer varchar(255) NOT NULL,
        created_at timestamp
        with
            time zone DEFAULT now (),
            updated_at timestamp
        with
            time zone DEFAULT now (),
            UNIQUE (question_id, game_id, user_id)
    );

-- Create a unique index for case-insensitive answers within the same game
CREATE UNIQUE INDEX unique_game_id_lower_answer ON public.pre_answers (game_id, LOWER(answer));

-- Enable Row Level Security
ALTER TABLE public.pre_answers ENABLE ROW LEVEL SECURITY;