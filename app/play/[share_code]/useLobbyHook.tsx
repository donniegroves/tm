import { useIsMaster } from "@/app/hooks/useIsMaster";
import { useInsideContext } from "@/app/inside/InsideContext";
import { Database } from "database.types";
import { useRealtimeContext } from "./RealtimeContext";

export function useLobbyHook() {
    const {
        gameUsers: allGameUsers,
        allUsers,
        loggedInUserId,
        preAnswers,
    } = useInsideContext();
    const { readyUsers, gameData } = useRealtimeContext();
    const { currentMasterUserId } = useIsMaster();

    const gameUsersIds = allGameUsers
        .filter((gu) => gu.game_id === gameData?.id)
        .map((gu) => gu.user_id);

    const nonMasterUsers = allGameUsers
        .filter(
            (gu) =>
                gu.game_id === gameData?.id &&
                gu.user_id !== currentMasterUserId
        )
        .map((gu) => allUsers.find((u) => u.user_id === gu.user_id))
        .filter(
            (user): user is Database["public"]["Tables"]["users"]["Row"] =>
                !!user
        );

    const allAnswersSubmitted: boolean = nonMasterUsers.every((user) =>
        preAnswers.some((answer) => answer.user_id === user.user_id)
    );

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
        allAnswersSubmitted,
    };
}
