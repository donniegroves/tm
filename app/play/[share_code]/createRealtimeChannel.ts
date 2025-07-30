import { createClient } from "@/utils/supabase/client";
import { QueryClient } from "@tanstack/react-query";
import { CursorMessage } from "./RealtimeContext";

export function createRealtimeChannel(
    supabase: ReturnType<typeof createClient>,
    queryClient: QueryClient,
    loggedInUserId: string,
    callbacks: {
        onPresenceSync: (users: string[]) => void;
        onCursorMove: (cursor: CursorMessage) => void;
    }
) {
    // TODO: change channel name
    const channel = supabase.channel("test-channel", {
        config: {
            presence: { key: loggedInUserId },
            broadcast: { self: true },
        },
    });

    channel.on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState<{ ready: boolean }>();
        callbacks.onPresenceSync(Object.keys(newState));
    });

    channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
        callbacks.onCursorMove({ x: payload.payload.x, y: payload.payload.y });
    });

    channel.on("broadcast", { event: "game-status-changed" }, () => {
        queryClient.invalidateQueries({ queryKey: ["games"] });
        queryClient.invalidateQueries({ queryKey: ["gameQuestions"] });
    });

    channel.on("broadcast", { event: "pre-answer-added" }, () => {
        queryClient.invalidateQueries({ queryKey: ["preAnswers"] });
    });

    channel.on("broadcast", { event: "game-reset" }, () => {
        queryClient.invalidateQueries({ queryKey: ["games"] });
        queryClient.invalidateQueries({ queryKey: ["gameQuestions"] });
        queryClient.invalidateQueries({ queryKey: ["preAnswers"] });
        queryClient.invalidateQueries({ queryKey: ["rankings"] });
    });

    return channel;
}
