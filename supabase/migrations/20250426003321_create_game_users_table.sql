CREATE TABLE
    public.game_users (
        game_id integer NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
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