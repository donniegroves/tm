import { useInsideContext } from "@/app/inside/InsideContext";
import { useRealtimeContext } from "./RealtimeContext";

export function useLobbyHook() {
    const {
        gameUsers: allGameUsers,
        allUsers,
        loggedInUserId,
    } = useInsideContext();
    const { readyUsers, gameData } = useRealtimeContext();

    const gameUsersIds = allGameUsers
        .filter((gu) => gu.game_id === gameData?.id)
        .map((gu) => gu.user_id);

    const thisGamesUsers = allUsers.filter((gu) =>
        gameUsersIds.includes(gu.user_id)
    );

    const hostUserId = allGameUsers.find(
        (gu) => gu.game_id === gameData?.id && gu.is_host
    )?.user_id;

    const loggedInUserIsHost = loggedInUserId === hostUserId;
    const allPlayersAreConnected = thisGamesUsers.every((gu) =>
        readyUsers.includes(gu.user_id)
    );

    const isGameReady = thisGamesUsers.length > 0 && !!hostUserId && !!gameData;

    return {
        thisGamesUsers,
        hostUserId,
        loggedInUserIsHost,
        allPlayersAreConnected,
        isGameReady,
        gameData,
    };
}
