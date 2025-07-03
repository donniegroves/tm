import { createClient } from "@/utils/supabase/server";
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
