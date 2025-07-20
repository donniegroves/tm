import { InsideContext } from "@/app/inside/InsideContext";
import {
    RealtimeContext,
    RealtimeContextType,
} from "@/app/play/[share_code]/RealtimeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    defaultInsideContextValues,
    defaultRealtimeContextValues,
} from "./helpers";

export const createWrapper = (
    insideContextValues = defaultInsideContextValues,
    realtimeContextValues:
        | RealtimeContextType
        | null
        | undefined = defaultRealtimeContextValues
) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <InsideContext.Provider value={insideContextValues}>
                {realtimeContextValues !== null ? (
                    <RealtimeContext.Provider value={realtimeContextValues}>
                        {children}
                    </RealtimeContext.Provider>
                ) : (
                    children
                )}
            </InsideContext.Provider>
        </QueryClientProvider>
    );
    return Wrapper;
};
