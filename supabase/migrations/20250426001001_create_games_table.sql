CREATE TABLE
    public.games (
        id serial PRIMARY KEY,
        host_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
        share_code varchar(6) UNIQUE NOT NULL,
        num_static_ai smallint CHECK (
            num_static_ai >= 0
            AND num_static_ai <= 9
        ),
        seconds_per_pre integer CHECK (
            seconds_per_pre >= 5
            AND seconds_per_pre <= 300
        ) NOT NULL,
        seconds_per_rank integer CHECK (
            seconds_per_rank >= 5
            AND seconds_per_rank <= 300
        ) NOT NULL,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT now (),
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT now ()
    );

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;