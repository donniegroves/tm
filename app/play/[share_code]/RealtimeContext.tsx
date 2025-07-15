import { RealtimeChannel } from "@supabase/supabase-js";
import { createContext, Dispatch, SetStateAction } from "react";

export const RealtimeContext = createContext<{
    channel: RealtimeChannel | null;
    readyUsers: string[];
    setReadyUsers: Dispatch<SetStateAction<string[]>>;
}>({
    channel: null,
    readyUsers: [],
    setReadyUsers: () => {},
});
