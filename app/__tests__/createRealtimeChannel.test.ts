import { QueryClient } from "@tanstack/react-query";
import { createRealtimeChannel } from "../play/[share_code]/createRealtimeChannel";

interface MockChannel {
    on: jest.Mock;
    presenceState: jest.Mock;
}

interface MockSupabase {
    channel: jest.Mock;
}

interface MockCallbacks {
    onPresenceSync: jest.Mock;
    onCursorMove: jest.Mock;
}

describe("createRealtimeChannel", () => {
    let mockChannel: MockChannel;
    let mockSupabase: MockSupabase;
    let mockQueryClient: QueryClient;
    let mockCallbacks: MockCallbacks;

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
        } as unknown as QueryClient;

        mockCallbacks = {
            onPresenceSync: jest.fn(),
            onCursorMove: jest.fn(),
        };
    });

    it("creates a channel with correct configuration", () => {
        const loggedInUserId = "user123";

        const result = createRealtimeChannel(
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
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
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
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
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const presenceSyncCall = mockChannel.on.mock.calls.find(
            (call: unknown[]) =>
                call[0] === "presence" &&
                (call[1] as { event: string }).event === "sync"
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
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
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
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const cursorPosCall = mockChannel.on.mock.calls.find(
            (call: unknown[]) =>
                call[0] === "broadcast" &&
                (call[1] as { event: string }).event === "cursor-pos"
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
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
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
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const gameStatusCall = mockChannel.on.mock.calls.find(
            (call: unknown[]) =>
                call[0] === "broadcast" &&
                (call[1] as { event: string }).event === "game-status-changed"
        );
        const gameStatusCallback = gameStatusCall[2];

        gameStatusCallback();

        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["games"],
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["gameQuestions"],
        });
    });

    it("sets up pre-answer-added broadcast event handler correctly", () => {
        createRealtimeChannel(
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(mockChannel.on).toHaveBeenCalledWith(
            "broadcast",
            { event: "pre-answer-added" },
            expect.any(Function)
        );
    });

    it("invalidates preAnswers query when pre-answer-added event fires", () => {
        createRealtimeChannel(
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const preAnswerAddedCall = mockChannel.on.mock.calls.find(
            (call: unknown[]) =>
                call[0] === "broadcast" &&
                (call[1] as { event: string }).event === "pre-answer-added"
        );
        const preAnswerAddedCallback = preAnswerAddedCall[2];

        preAnswerAddedCallback();

        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["preAnswers"],
        });
    });

    it("sets up game-reset broadcast event handler correctly", () => {
        createRealtimeChannel(
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(mockChannel.on).toHaveBeenCalledWith(
            "broadcast",
            { event: "game-reset" },
            expect.any(Function)
        );
    });

    it("invalidates multiple queries when game-reset event fires", () => {
        createRealtimeChannel(
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        const gameResetCall = mockChannel.on.mock.calls.find(
            (call: unknown[]) =>
                call[0] === "broadcast" &&
                (call[1] as { event: string }).event === "game-reset"
        );
        const gameResetCallback = gameResetCall[2];

        gameResetCallback();

        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["games"],
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["gameQuestions"],
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["preAnswers"],
        });
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ["rankings"],
        });
    });

    it("sets up all five event handlers", () => {
        createRealtimeChannel(
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(mockChannel.on).toHaveBeenCalledTimes(5);

        const calls = mockChannel.on.mock.calls;
        expect(
            calls.some(
                (call: unknown[]) =>
                    call[0] === "presence" &&
                    (call[1] as { event: string }).event === "sync"
            )
        ).toBe(true);
        expect(
            calls.some(
                (call: unknown[]) =>
                    call[0] === "broadcast" &&
                    (call[1] as { event: string }).event === "cursor-pos"
            )
        ).toBe(true);
        expect(
            calls.some(
                (call: unknown[]) =>
                    call[0] === "broadcast" &&
                    (call[1] as { event: string }).event ===
                        "game-status-changed"
            )
        ).toBe(true);
        expect(
            calls.some(
                (call: unknown[]) =>
                    call[0] === "broadcast" &&
                    (call[1] as { event: string }).event === "pre-answer-added"
            )
        ).toBe(true);
        expect(
            calls.some(
                (call: unknown[]) =>
                    call[0] === "broadcast" &&
                    (call[1] as { event: string }).event === "game-reset"
            )
        ).toBe(true);
    });

    it("returns the created channel", () => {
        const result = createRealtimeChannel(
            mockSupabase as unknown as Parameters<
                typeof createRealtimeChannel
            >[0],
            mockQueryClient,
            "user123",
            mockCallbacks
        );

        expect(result).toBe(mockChannel);
    });
});
