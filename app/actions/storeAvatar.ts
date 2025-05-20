import { createClient } from "@/utils/supabase/server";
import { Database } from "database.types";

export async function storeAvatar(
    userId: Database["public"]["Tables"]["users"]["Row"]["user_id"],
    avatarUrl: Database["public"]["Tables"]["users"]["Row"]["avatar_url"]
) {
    try {
        if (!avatarUrl) return null;

        const response = await fetch(avatarUrl);
        if (!response.ok) throw new Error("Failed to download avatar");

        const contentType = response.headers.get("content-type");
        if (!contentType) throw new Error("Content-Type header is missing");

        const ext = contentType.split("/")[1].split(";")[0]; // e.g. "jpeg"
        const buffer = await response.arrayBuffer();
        const fileName = `${userId}.${ext}`;

        const supabase = await createClient();

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, buffer, {
                contentType,
                upsert: true,
            });
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    } catch {
        throw new Error("Error caching avatar");
    }
}
