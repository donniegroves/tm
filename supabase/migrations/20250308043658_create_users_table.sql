CREATE TABLE
    public.users (
        user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
        access_level smallint NOT NULL DEFAULT 0,
        created_at timestamp
        WITH
            time zone DEFAULT now (),
            updated_at timestamp
        WITH
            time zone DEFAULT now ()
    );

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;