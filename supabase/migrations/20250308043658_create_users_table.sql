CREATE TABLE
    public.users (
        user_id uuid primary key references auth.users (id) on delete cascade,
        access_level smallint not null default 0,
        created_at timestamp
        with
            time zone default now (),
            updated_at timestamp
        with
            time zone default now ()
    );

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;