import { createClient } from "@/utils/supabase/server";

export const isUserIdInPublicUserTable = async (userId: string) => {
    try {
        const supabase = await createClient();
        const { data: existingUserData, error: existingUserError } =
            await supabase
                .from("users")
                .select("user_id")
                .eq("user_id", userId)
                .maybeSingle();

        if (existingUserError) {
            throw new Error("Error checking existing user");
        }

        return !!existingUserData?.user_id;
    } catch (error) {
        console.error("Error in isUserIdInPublicUserTable:", error);
        throw error;
    }
};
