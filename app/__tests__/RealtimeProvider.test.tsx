import { createClient } from "@/utils/supabase/client";
import { render, screen, waitFor } from "@testing-library/react";
import { createRealtimeChannel } from "../play/[share_code]/createRealtimeChannel";
import {
    RealtimeProvider,
    useRealtimeContext,
} from "../play/[share_code]/RealtimeContext";
import { createWrapper } from "./helpers/createWrapper";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

jest.mock("../play/[share_code]/createRealtimeChannel", () => ({
    createRealtimeChannel: jest.fn(),
}));

const createClientMock = createClient as jest.Mock;
const createRealtimeChannelMock = createRealtimeChannel as jest.Mock;

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries,
    }),
}));
describe("RealtimeProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(window, "location", {
            value: {
                pathname: "/play/test-share-code/some-page",
            },
            writable: true,
        });
    });

    it("renders children and sets up channel correctly", async () => {
        const mockUnsubscribe = jest.fn();
        const mockTrack = jest.fn();
        const mockSubscribe = jest.fn((callback) => {
            setTimeout(() => callback("SUBSCRIBED"), 0);
            return {
                unsubscribe: mockUnsubscribe,
                track: mockTrack,
            };
        });

        const mockChannel = {
            subscribe: mockSubscribe,
            track: mockTrack,
        };

        createRealtimeChannelMock.mockReturnValue(mockChannel);

        createClientMock.mockReturnValue({
            channel: jest.fn(),
        });

        function TestConsumer() {
            const { readyUsers, cursor, channel, gameData } =
                useRealtimeContext();
            return (
                <div>
                    <div>Test Child</div>
                    <div data-testid="channel-status">
                        {channel ? "channel-connected" : "no-channel"}
                    </div>
                    <div data-testid="ready-users">
                        {readyUsers.length > 0
                            ? readyUsers.join(",")
                            : "no-users"}
                    </div>
                    <div data-testid="cursor-pos">
                        {cursor ? `${cursor.x},${cursor.y}` : "no-cursor"}
                    </div>
                    <div data-testid="game-data">
                        {gameData ? gameData.share_code : "no-game"}
                    </div>
                </div>
            );
        }

        render(
            <RealtimeProvider>
                <TestConsumer />
            </RealtimeProvider>,
            {
                wrapper: createWrapper(undefined, null),
            }
        );

        expect(screen.getByText("Test Child")).toBeInTheDocument();

        expect(createRealtimeChannelMock).toHaveBeenCalledWith(
            expect.any(Object), // supabase client
            expect.any(Object), // queryClient
            expect.any(String), // loggedInUserId
            expect.objectContaining({
                onPresenceSync: expect.any(Function),
                onCursorMove: expect.any(Function),
            })
        );

        expect(mockSubscribe).toHaveBeenCalledWith(expect.any(Function));

        await waitFor(() => {
            expect(mockTrack).toHaveBeenCalledWith({ ready: true });
        });

        expect(screen.getByTestId("ready-users")).toHaveTextContent("no-users");
        expect(screen.getByTestId("cursor-pos")).toHaveTextContent("no-cursor");

        await waitFor(() => {
            expect(screen.getByTestId("channel-status")).toHaveTextContent(
                "channel-connected"
            );
        });
    });

    it("handles cleanup on unmount", () => {
        const mockUnsubscribe = jest.fn();
        const mockChannel = {
            subscribe: jest.fn(() => ({
                unsubscribe: mockUnsubscribe,
            })),
        };

        createRealtimeChannelMock.mockReturnValue(mockChannel);
        createClientMock.mockReturnValue({
            channel: jest.fn(),
        });

        const { unmount } = render(
            <RealtimeProvider>
                <div>Test</div>
            </RealtimeProvider>,
            {
                wrapper: createWrapper(undefined, null),
            }
        );

        unmount();

        expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it("does not set up channel when loggedInUserId is not available", () => {
        createRealtimeChannelMock.mockReturnValue({
            subscribe: jest.fn(),
        });

        render(
            <RealtimeProvider>
                <div>Test</div>
            </RealtimeProvider>,
            {
                wrapper: createWrapper({
                    loggedInUserId: "",
                    allUsers: [],
                    games: [],
                    questions: [],
                    gameUsers: [],
                    gameQuestions: [],
                }),
            }
        );

        expect(createRealtimeChannelMock).not.toHaveBeenCalled();
    });
});
