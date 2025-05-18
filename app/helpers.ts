import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { Database } from "database.types";

export const getUserFromPublic = async (
    userId: string
): Promise<Database["public"]["Tables"]["users"]["Row"] | null> => {
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
        throw error;
    }
};

export async function fetchLayoutData(): Promise<{
    loggedInUserId: string;
    allUsers: Database["public"]["Tables"]["users"]["Row"][];
    gamesData: Database["public"]["Tables"]["games"]["Row"][];
    questions: Database["public"]["Tables"]["questions"]["Row"][];
}> {
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

    const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select();
    if (questionsError) {
        throw new Error("Error fetching questions");
    }

    return {
        loggedInUserId: authUserData.user.id,
        allUsers,
        gamesData,
        questions,
    };
}

export function mapAuthUserRowToPublicUserRow(
    authUserRow: User
): Database["public"]["Tables"]["users"]["Insert"] {
    if (!authUserRow.email) {
        throw new Error("Email was not found in authUserRow");
    }

    return {
        avatar_url: authUserRow.user_metadata.avatar_url,
        email: authUserRow.email,
        full_name: authUserRow.user_metadata.full_name,
        user_id: authUserRow.id,
    };
}
