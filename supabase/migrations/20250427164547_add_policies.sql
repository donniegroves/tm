CREATE POLICY "Enable users to view their own data only" ON public.users AS PERMISSIVE FOR
SELECT
    TO authenticated USING (
        (
            SELECT
                auth.uid ()
        ) = user_id
    );

CREATE POLICY "Enable insert for users based on user_id" ON public.users AS PERMISSIVE FOR INSERT TO public
WITH
    check (
        (
            SELECT
                auth.uid ()
        ) = user_id
    );

CREATE POLICY "Allow selects on games for users with access_level 2" ON public.games FOR
SELECT
    TO authenticated USING (
        (
            SELECT
                access_level
            FROM
                public.users
            WHERE
                user_id = (
                    SELECT
                        auth.uid ()
                )
        ) = 2
    );

CREATE POLICY "Enable hosts to view their own games" ON public.games AS PERMISSIVE FOR
SELECT
    TO authenticated USING (
        (
            SELECT
                auth.uid ()
        ) = host_user_id
    );

CREATE POLICY "Allow users to select games they are associated with" ON public.games FOR
SELECT
    TO authenticated USING (
        id IN (
            SELECT
                game_users.game_id
            FROM
                game_users
            WHERE
                (game_users.user_id = auth.uid ())
        )
    );

CREATE POLICY "Allow users to select their own game_users rows" ON public.game_users FOR
SELECT
    TO authenticated USING (
        (
            SELECT
                auth.uid ()
        ) = user_id
    );