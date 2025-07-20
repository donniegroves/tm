import PlayCanvas from "@/app/components/PlayCanvas";
import UsersStatusPanel from "@/app/components/UsersStatusPanel";
import Lobby from "./Lobby";
import { useRealtimeContext } from "./RealtimeContext";

export default function PlayStageContent() {
    const { channel, gameData } = useRealtimeContext();

    return (
        <>
            {gameData && gameData.status === 0 && channel && (
                <div className="flex flex-row w-full flex-1">
                    <Lobby />
                    <UsersStatusPanel />
                </div>
            )}
            {gameData && gameData.status > 0 && channel && (
                <div className="flex flex-row w-full flex-1">
                    <PlayCanvas />
                    <UsersStatusPanel />
                </div>
            )}
        </>
    );
}
