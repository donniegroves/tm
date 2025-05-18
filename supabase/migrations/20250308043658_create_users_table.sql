CREATE TABLE
    public.users (
        user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
        username text UNIQUE,
        full_name text,
        email text UNIQUE NOT NULL,
        access_level smallint NOT NULL DEFAULT 0,
        avatar_url text,
        timezone text DEFAULT 'UTC',
        created_at timestamp
        WITH
            time zone DEFAULT now (),
            updated_at timestamp
        WITH
            time zone DEFAULT now ()
    );

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;