CREATE OR REPLACE FUNCTION is_admin(input_user_id uuid)
            returns boolean AS
        $$
        select true from users
        where user_id = input_user_id and access_level = 2
        $$ stable language sql security definer;

CREATE POLICY "Enable users to view their own data only" ON public.users AS PERMISSIVE FOR
SELECT
    TO authenticated USING (
          ((auth.uid() = user_id) OR is_admin(auth.uid()))
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
        is_admin(auth.uid())
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
          (( SELECT auth.uid() AS uid) = user_id)
    );

CREATE POLICY "Allow admins to select all game_users rows" ON public.game_users FOR
SELECT
    TO authenticated USING (
          (is_admin(auth.uid()))
    );

create policy "Enable read access for all users"
on "public"."questions"
as PERMISSIVE
for SELECT
to authenticated
using (true);

create policy "Enable insert for authenticated users only"
on "public"."questions"
as PERMISSIVE
for INSERT
to authenticated
with check ( is_admin(auth.uid()) );

create policy "Enable delete for admins"
on "public"."questions"
as PERMISSIVE
for DELETE
to authenticated
using ( is_admin(auth.uid()) );

create policy "Allow admins to update rows"
on "public"."users"
to authenticated
using ((is_admin(auth.uid()) OR (auth.uid() = user_id)))
with check ((is_admin(auth.uid()) OR (access_level <> 2)) AND (auth.uid() = user_id));

create policy "Allow superadmins to update questions"
on "public"."questions"
to authenticated
using (is_admin(auth.uid()))
with check (true);

create policy "Allow admins to insert games"
on "public"."games"
to authenticated
with check (is_admin(auth.uid()));

create policy "Allow admins to insert rows"
on "public"."game_users"
to authenticated
with check (is_admin(auth.uid()));