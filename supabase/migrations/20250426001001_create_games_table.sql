CREATE TABLE
    public.games (
        id serial PRIMARY KEY,
        share_code varchar(6) UNIQUE NOT NULL,
        status smallint NOT NULL DEFAULT 0 CHECK (
            status >= 0
            AND status <= 2
        ),
        num_static_ai smallint NOT NULL CHECK (
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