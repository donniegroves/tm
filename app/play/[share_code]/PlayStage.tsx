"use client";

import PlayCanvas from "@/app/components/PlayCanvas";
import UsersStatusPanel from "@/app/components/UsersStatusPanel";
import { useInsideContext } from "@/app/inside/InsideContext";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { Database } from "database.types";
import { useEffect, useState } from "react";
import Lobby from "./Lobby";
import { RealtimeContext } from "./RealtimeContext";

export interface CursorMessage {
    x: number;
    y: number;
}

export default function PlayStage({ share_code }: { share_code: string }) {
    const supabase = createClient();
    const [readyUsers, setReadyUsers] = useState<
        Database["public"]["Tables"]["users"]["Row"]["user_id"][]
    >([]);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);
    const [cursor, setCursor] = useState<CursorMessage | null>(null);

    const { games, loggedInUserId } = useInsideContext();
    const queryClient = useQueryClient();

    const gameData = games.find((g) => g.share_code === share_code);

    useEffect(() => {
        const channel = supabase.channel("test-channel", {
            config: {
                presence: { key: loggedInUserId },
                broadcast: { self: true },
            },
        });

        channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
            setCursor({ x: payload.payload.x, y: payload.payload.y });
        });

        channel.on("presence", { event: "sync" }, () => {
            const newState = channel.presenceState<{ ready: boolean }>();
            const newStateKeys = Object.keys(newState);
            setReadyUsers(newStateKeys);
        });

        channel.on("broadcast", { event: "game-status-changed" }, () => {
            queryClient.invalidateQueries({
                queryKey: ["games"],
            });
        });

        const subscribedChannel = channel.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                const payload = {
                    ready: true,
                };
                await channel.track(payload);
            }
        });

        setChannel(subscribedChannel);

        return () => {
            subscribedChannel.unsubscribe();
        };
    }, [loggedInUserId, supabase, queryClient]);

    return (
        <RealtimeContext.Provider
            value={{ channel, readyUsers, setReadyUsers }}
        >
            {gameData?.status === 0 && channel && (
                <div className="flex flex-row w-full flex-1 test-div">
                    <Lobby channel={channel} gameData={gameData} />
                    <div className="flex-shrink-0 w-32 flex items-center">
                        <UsersStatusPanel
                            channel={channel}
                            gameData={gameData}
                            readyUsers={readyUsers}
                        />
                    </div>
                </div>
            )}
            {gameData && gameData.status > 0 && channel && (
                <div className="flex flex-row w-full flex-1 test-div">
                    <PlayCanvas cursor={cursor} />
                    <div className="flex-shrink-0 w-32 flex items-center">
                        <UsersStatusPanel
                            channel={channel}
                            gameData={gameData}
                            readyUsers={readyUsers}
                        />
                    </div>
                </div>
            )}
        </RealtimeContext.Provider>
    );
}
