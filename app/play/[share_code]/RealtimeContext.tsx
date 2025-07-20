import { useInsideContext } from "@/app/inside/InsideContext";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { Database } from "database.types";
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { createRealtimeChannel } from "./createRealtimeChannel";

export interface RealtimeContextType {
    readyUsers: string[];
    setReadyUsers: Dispatch<SetStateAction<string[]>>;
    channel: RealtimeChannel | null;
    setChannel: Dispatch<SetStateAction<RealtimeChannel | null>>;
    cursor: CursorMessage | null;
    setCursor: Dispatch<SetStateAction<CursorMessage | null>>;
    gameData: Database["public"]["Tables"]["games"]["Row"] | undefined;
}

export interface CursorMessage {
    x: number;
    y: number;
}

export const defaultValue: RealtimeContextType = {
    readyUsers: [],
    setReadyUsers: () => {},
    channel: null,
    setChannel: () => {},
    cursor: null,
    setCursor: () => {},
    gameData: undefined,
};

export const RealtimeContext = createContext<RealtimeContextType>(defaultValue);

export function RealtimeProvider({ children }: { children: ReactNode }) {
    const { loggedInUserId, games } = useInsideContext();
    const supabase = createClient();
    const queryClient = useQueryClient();

    const share_code = window.location.pathname.split("/")[2];
    const gameData = games.find((g) => g.share_code === share_code);

    const [readyUsers, setReadyUsers] = useState<
        Database["public"]["Tables"]["users"]["Row"]["user_id"][]
    >([]);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);
    const [cursor, setCursor] = useState<CursorMessage | null>(null);

    const handleSubscription = async (
        realtimeChannel: RealtimeChannel,
        status: string
    ) => {
        if (status === "SUBSCRIBED") {
            const payload = { ready: true };
            await realtimeChannel.track(payload);
        }
    };

    useEffect(() => {
        if (!loggedInUserId) return;

        const realtimeChannel = createRealtimeChannel(
            supabase,
            queryClient,
            loggedInUserId,
            {
                onPresenceSync: setReadyUsers,
                onCursorMove: setCursor,
            }
        );

        const subscribedChannel = realtimeChannel.subscribe((status) =>
            handleSubscription(realtimeChannel, status)
        );

        setChannel(subscribedChannel);

        return () => {
            subscribedChannel.unsubscribe();
        };
    }, [loggedInUserId]);

    return (
        <RealtimeContext.Provider
            value={{
                readyUsers,
                setReadyUsers,
                channel,
                setChannel,
                cursor,
                setCursor,
                gameData,
            }}
        >
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtimeContext() {
    const context = useContext(RealtimeContext);
    if (!context) {
        throw new Error(
            "useRealtimeContext must be used within RealtimeProvider"
        );
    }
    return context;
}
