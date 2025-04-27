CREATE TABLE
    public.questions (
        id serial PRIMARY KEY,
        pre_question varchar(255) NOT NULL,
        rank_prompt varchar(255) NOT NULL,
        created_at timestamp
        with
            time zone default now (),
            updated_at timestamp
        with
            time zone default now ()
    );

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;