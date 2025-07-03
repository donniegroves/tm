import { User } from "@supabase/supabase-js";
import { Database } from "database.types";

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

export function getUserFromAllUsers(
    needle: Partial<
        Pick<
            Database["public"]["Tables"]["users"]["Row"],
            "user_id" | "email" | "username"
        >
    >,
    haystack: Database["public"]["Tables"]["users"]["Row"][]
): Database["public"]["Tables"]["users"]["Row"] | undefined {
    return haystack.find(
        (user) =>
            (needle.user_id && user.user_id === needle.user_id) ||
            (needle.email && user.email === needle.email) ||
            (needle.username && user.username === needle.username)
    );
}

export function getFullNameStringFromUser(
    user: Database["public"]["Tables"]["users"]["Row"] | undefined
): string | undefined {
    return user?.full_name ?? undefined;
}

export function getAvatarUrlFromUser(
    user: Database["public"]["Tables"]["users"]["Row"] | undefined
): string | undefined {
    return user?.avatar_url ?? undefined;
}
