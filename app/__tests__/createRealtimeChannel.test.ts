import { QueryClient } from "@tanstack/react-query";
import { createRealtimeChannel } from "../play/[share_code]/createRealtimeChannel";

describe("createRealtimeChannel", () => {
    let mockChannel: any;
    let mockSupabase: any;
    let mockQueryClient: QueryClient;
    let mockCallbacks: any;

    beforeEach(() => {
        mockChannel = {
            on: jest.fn(),
            presenceState: jest.fn(),
        };

        mockSupabase = {
            channel: jest.fn(() => mockChannel),
        };

        mockQueryClient = {
            invalidateQueries: jest.fn(),
        } as any;

        mockCallbacks = {
            onPresenceSync: jest.fn(),
            onCursorMove: jest.fn(),
        };
    });

    it("creates a channel with correct configuration", () => {
        const loggedInUserId = "user123";

        const result = createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            loggedInUserId,
            mockCallbacks
        );

        expect(mockSupabase.channel).toHaveBeenCalledWith("test-channel", {
            config: {
                presence: { key: loggedInUserId },
                broadcast: { self: true },
            },
        });

        expect(result).toBe(mockChannel);
    });

    it("sets up presence event handler correctly", () => {
        createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(mockChannel.on).toHaveBeenCalledWith(
            "presence",
            { event: "sync" },
            expect.any(Function)
        );
    });

    it("calls onPresenceSync callback when presence sync event fires", () => {
        createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const presenceSyncCall = mockChannel.on.mock.calls.find(
            (call: any[]) => call[0] === "presence" && call[1].event === "sync"
        );
        const presenceSyncCallback = presenceSyncCall[2];

        mockChannel.presenceState.mockReturnValue({
            user1: { ready: true },
            user2: { ready: false },
            user3: { ready: true },
        });

        presenceSyncCallback();

        expect(mockChannel.presenceState).toHaveBeenCalledWith();
        expect(mockCallbacks.onPresenceSync).toHaveBeenCalledWith([
            "user1",
            "user2",
            "user3",
        ]);
    });

    it("sets up cursor-pos broadcast event handler correctly", () => {
        createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(mockChannel.on).toHaveBeenCalledWith(
            "broadcast",
            { event: "cursor-pos" },
            expect.any(Function)
        );
    });

    it("calls onCursorMove callback when cursor-pos broadcast event fires", () => {
        createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const cursorPosCall = mockChannel.on.mock.calls.find(
            (call: any[]) =>
                call[0] === "broadcast" && call[1].event === "cursor-pos"
        );
        const cursorPosCallback = cursorPosCall[2];

        const mockPayload = {
            payload: { x: 150, y: 250 },
        };

        cursorPosCallback(mockPayload);

        expect(mockCallbacks.onCursorMove).toHaveBeenCalledWith({
            x: 150,
            y: 250,
        });
    });

    it("sets up game-status-changed broadcast event handler correctly", () => {
        createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(mockChannel.on).toHaveBeenCalledWith(
            "broadcast",
            { event: "game-status-changed" },
            expect.any(Function)
        );
    });

    it("invalidates games query when game-status-changed event fires", () => {
        createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const gameStatusCall = mockChannel.on.mock.calls.find(
            (call: any[]) =>
                call[0] === "broadcast" &&
                call[1].event === "game-status-changed"
        );
        const gameStatusCallback = gameStatusCall[2];

        gameStatusCallback();

        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["games"],
        });
    });

    it("sets up all three event handlers", () => {
        createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(mockChannel.on).toHaveBeenCalledTimes(3);

        const calls = mockChannel.on.mock.calls;
        expect(
            calls.some(
                (call: any[]) =>
                    call[0] === "presence" && call[1].event === "sync"
            )
        ).toBe(true);
        expect(
            calls.some(
                (call: any[]) =>
                    call[0] === "broadcast" && call[1].event === "cursor-pos"
            )
        ).toBe(true);
        expect(
            calls.some(
                (call: any[]) =>
                    call[0] === "broadcast" &&
                    call[1].event === "game-status-changed"
            )
        ).toBe(true);
    });

    it("returns the created channel", () => {
        const result = createRealtimeChannel(
            mockSupabase,
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(result).toBe(mockChannel);
    });
});
