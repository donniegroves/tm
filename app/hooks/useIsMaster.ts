import {
    getGameUserIdsInDeterministicOrder,
    getStatusUsingShareCode,
} from "../helpers";
import { useInsideContext } from "../inside/InsideContext";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";

export function useIsMaster(): {
    loggedInUserIsMaster: boolean;
    currentMasterUserId: string | undefined;
} {
    const { games, gameUsers, loggedInUserId } = useInsideContext();
    const { gameData } = useRealtimeContext();
    const { round } = getStatusUsingShareCode(games);
    const orderOfMasters = getGameUserIdsInDeterministicOrder(
        gameUsers,
        gameData?.share_code ?? ""
    );

    const currentMasterUserId = orderOfMasters[(round ?? 0) - 1];
    const loggedInUserIsMaster = currentMasterUserId === loggedInUserId;

    return {
        loggedInUserIsMaster,
        currentMasterUserId,
    };
}
