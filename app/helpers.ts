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
