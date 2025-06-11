"use client";

import { createClient } from "@/utils/supabase/client";

export const updateProfile = async ({ userId }: { userId: string }) => {
    const form = document.getElementById("profile-form");
    const usernameInput = form?.querySelector("input");
    const timezoneSelect = form?.querySelector("select");

    if (!form || !usernameInput || !timezoneSelect) {
        throw new Error("Proper form elements not found to update profile");
    }

    const username = (usernameInput as HTMLInputElement).value;
    const timezone = (timezoneSelect as HTMLSelectElement).value;

    const supabase = createClient();

    const { error, status } = await supabase
        .from("users")
        .update({
            username: username,
            timezone: timezone,
        })
        .eq("user_id", userId);

    if (error || status !== 204) {
        throw new Error("Failed to update profile");
    }
};
