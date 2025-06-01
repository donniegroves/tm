import { createClient } from "@/utils/supabase/client";
import { Database } from "database.types";

export async function fetchAllUsers(): Promise<
    Database["public"]["Tables"]["users"]["Row"][]
> {
    const supabase = createClient();
    const { data: allUsers, error } = await supabase.from("users").select("*");

    if (error || !allUsers) {
        throw new Error("Error fetching users");
    }

    return allUsers;
}
