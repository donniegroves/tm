import { createClient } from "@/utils/supabase/server";

export const getUserFromPublic = async (userId: string) => {
    try {
        const supabase = await createClient();
        const { data: existingUserData, error: existingUserError } =
            await supabase
                .from("users")
                .select()
                .eq("user_id", userId)
                .maybeSingle();

        if (existingUserError) {
            throw new Error("Error checking existing user");
        }

        return existingUserData;
    } catch (error) {
        console.error("Error in getUserFromPublic:", error);
        throw error;
    }
};

export async function fetchLayoutData() {
    const supabase = await createClient();

    const { data: authUserData, error: authUserError } =
        await supabase.auth.getUser();
    if (authUserError || !authUserData.user) {
        throw new Error("Error fetching authenticated user");
    }

    const { data: allUsers, error: usersQueryError } = await supabase
        .from("users")
        .select("*");
    if (usersQueryError || !allUsers) {
        throw new Error("Error fetching users");
    }

    const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select();
    if (gamesError) {
        throw new Error("Error fetching games");
    }

    const authedAccessLevel = allUsers.find(
        (user) => user.user_id === authUserData.user?.id
    )?.access_level;
    if (authedAccessLevel === undefined) {
        throw new Error("Access level not found for authenticated user");
    }

    const loggedInUser = {
        ...authUserData.user,
        access_level: authedAccessLevel,
    };
    const otherUsers = allUsers.filter(
        (user) => user.user_id !== authUserData.user?.id
    );

    return { loggedInUser, otherUsers, gamesData };
}
