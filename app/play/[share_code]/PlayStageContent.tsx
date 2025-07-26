import PlayCanvas from "@/app/components/PlayCanvas";
import PlayPreQuestion from "@/app/components/PlayPreQuestion";
import UsersStatusPanel from "@/app/components/UsersStatusPanel";
import { getStatusUsingShareCode } from "@/app/helpers";
import { useInsideContext } from "@/app/inside/InsideContext";
import Lobby from "./Lobby";
import { useRealtimeContext } from "./RealtimeContext";

export default function PlayStageContent() {
    const { channel, gameData } = useRealtimeContext();
    const { games } = useInsideContext();

    const { status } = getStatusUsingShareCode(games);

    if (!gameData || !channel) {
        return <div>Play stage content could not load.</div>;
    }

    return (
        <>
            {status === "not started" && (
                <div className="flex flex-row w-full flex-1">
                    <Lobby />
                    <UsersStatusPanel />
                </div>
            )}
            {status === "pre-question" && (
                <div className="flex flex-row w-full flex-1">
                    <PlayPreQuestion />
                    <UsersStatusPanel />
                </div>
            )}
            {status === "ranking" && (
                <div className="flex flex-row w-full flex-1">
                    <PlayCanvas />
                    <UsersStatusPanel />
                </div>
            )}
        </>
    );
}
