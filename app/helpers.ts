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

export function getStatusUsingShareCode(
    allGames: Database["public"]["Tables"]["games"]["Row"][]
) {
    const share_code = window.location.pathname.split("/")[2];
    const thisGame = allGames.find((g) => g.share_code === share_code);

    if (!thisGame) {
        throw new Error("Game not found");
    }

    if (thisGame.status === 0) {
        return { round: null, status: "not started" };
    } else if (thisGame.status === -1) {
        return { round: null, status: "ended" };
    } else if (thisGame.status > 0 && thisGame.status % 2 === 1) {
        return { round: (thisGame.status + 1) / 2, status: "pre-question" };
    } else if (thisGame.status > 0 && thisGame.status % 2 === 0) {
        return { round: thisGame.status / 2, status: "ranking" };
    }

    throw new Error("Invalid game status");
}

export function getGameUserIdsInDeterministicOrder(
    gameUsers: Database["public"]["Tables"]["game_users"]["Row"][],
    seed: string
) {
    const userIds = gameUsers.map((user) => user.user_id);

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    let seedValue = Math.abs(hash);
    const seededRandom = () => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
    };

    const shuffled = [...userIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}
