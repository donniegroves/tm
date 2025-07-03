import { createClient } from "@/utils/supabase/client";

export async function fetchLoggedInUserId(): Promise<string> {
    const supabase = createClient();
    const { data: authUserData, error: authUserError } =
        await supabase.auth.getUser();

    if (authUserError || !authUserData.user) {
        throw new Error("Error fetching authenticated user");
    }

    return authUserData.user.id;
}
