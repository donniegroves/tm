import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchAllUsers(): Promise<
    Database["public"]["Tables"]["users"]["Row"][]
> {
    const supabase = createClient();
    const { data: allUsers, error } = await supabase
        .from("view_users")
        .select("*");

    if (error || !allUsers) {
        throw new Error("Error fetching users");
    }

    const mappedUsers: Database["public"]["Tables"]["users"]["Row"][] =
        allUsers.map((user) => {
            if (
                user.access_level === null ||
                !user.created_at ||
                !user.email ||
                !user.updated_at ||
                !user.user_id ||
                !user.email
            ) {
                throw new Error("User data is incomplete");
            }

            return {
                access_level: user.access_level,
                avatar_url: user.avatar_url,
                created_at: user.created_at,
                email: user.email,
                full_name: user.full_name,
                timezone: user.timezone,
                updated_at: user.updated_at,
                user_id: user.user_id,
                username: user.username,
            };
        });

    return mappedUsers;
}
