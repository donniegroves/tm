"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "database.types";

export const insertPublicUser = async ({
    userData,
}: {
    userData: Database["public"]["Tables"]["users"]["Insert"];
}) => {
    const supabase = await createClient();
    const { error } = await supabase.from("users").insert([userData]);

    if (error) {
        throw new Error();
    }
};
