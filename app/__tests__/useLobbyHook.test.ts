import { renderHook } from "@testing-library/react";
import { useLobbyHook } from "../play/[share_code]/useLobbyHook";
import { createWrapper } from "./helpers/createWrapper";
import {
    defaultInsideContextValues,
    defaultRealtimeContextValues,
    mockAllUsers,
    mockGamesData,
    mockGameUsersData,
} from "./helpers/helpers";

jest.mock("@/app/hooks/useIsMaster", () => ({
    useIsMaster: jest.fn(() => ({
        loggedInUserIsMaster: false,
        currentMasterUserId: "test-master-id",
    })),
}));

describe("useLobbyHook", () => {
    it("returns correct values for a valid game", () => {
        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(),
        });

        expect(result.current.gameData).toEqual(mockGamesData[1]);
        expect(result.current.hostUserId).toBe(mockAllUsers[0].user_id);
        expect(result.current.loggedInUserIsHost).toBe(true);
        expect(result.current.thisGamesUsers).toHaveLength(2);
        expect(result.current.allPlayersAreConnected).toBe(false);
        expect(result.current.isGameReady).toBe(true);
    });

    it("identifies correct game users for the current game", () => {
        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(),
        });

        const expectedUsers = [mockAllUsers[0], mockAllUsers[2]];

        expect(result.current.thisGamesUsers).toEqual(expectedUsers);
    });

    it("detects when logged in user is not the host", () => {
        const customInsideContextValues = {
            ...defaultInsideContextValues,
            loggedInUserId: "user3",
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(customInsideContextValues),
        });

        expect(result.current.loggedInUserIsHost).toBe(false);
        expect(result.current.hostUserId).toBe(mockAllUsers[0].user_id);
    });

    it("detects when all players are connected", () => {
        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            readyUsers: [mockAllUsers[0].user_id, mockAllUsers[2].user_id],
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        expect(result.current.allPlayersAreConnected).toBe(true);
    });

    it("detects when some players are not connected", () => {
        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            readyUsers: [mockAllUsers[0].user_id],
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        expect(result.current.allPlayersAreConnected).toBe(false);
    });

    it("returns isGameReady as false when no game data", () => {
        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            gameData: undefined,
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        expect(result.current.isGameReady).toBe(false);
        expect(result.current.gameData).toBeUndefined();
    });

    it("returns isGameReady as false when no host found", () => {
        const customInsideContextValues = {
            ...defaultInsideContextValues,
            gameUsers: [
                // Remove host designation from all game users for the current game
                {
                    user_id: mockAllUsers[0].user_id,
                    game_id: mockGamesData[1].id,
                    is_host: false, // Changed from true to false
                    created_at: "2024-06-01T12:00:00Z",
                    updated_at: "2024-06-01T12:00:00Z",
                },
                {
                    user_id: mockAllUsers[2].user_id,
                    game_id: mockGamesData[1].id,
                    is_host: false, // Already false
                    created_at: "2024-06-01T12:00:00Z",
                    updated_at: "2024-06-01T12:00:00Z",
                },
            ],
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(customInsideContextValues),
        });

        expect(result.current.hostUserId).toBeUndefined();
        expect(result.current.isGameReady).toBe(false);
    });

    it("returns isGameReady as false when no game users", () => {
        const customInsideContextValues = {
            ...defaultInsideContextValues,
            gameUsers: [],
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(customInsideContextValues),
        });

        expect(result.current.isGameReady).toBe(false);
        expect(result.current.thisGamesUsers).toHaveLength(0);
    });

    it("handles undefined gameData.id gracefully", () => {
        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            gameData: {
                ...mockGamesData[1],
                id: undefined as unknown as number,
            },
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        expect(result.current.thisGamesUsers).toHaveLength(0);
        expect(result.current.hostUserId).toBeUndefined();
        expect(result.current.isGameReady).toBe(false);
    });

    it("filters game users correctly for different games", () => {
        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            gameData: mockGamesData[2], //
        };

        const customInsideContextValues = {
            ...defaultInsideContextValues,
            gameUsers: [
                ...mockGameUsersData,

                {
                    user_id: mockAllUsers[1].user_id,
                    game_id: mockGamesData[2].id,
                    is_host: true,
                    created_at: "2024-06-01T12:00:00Z",
                    updated_at: "2024-06-01T12:00:00Z",
                },
            ],
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(
                customInsideContextValues,
                customRealtimeContextValues
            ),
        });

        expect(result.current.thisGamesUsers).toHaveLength(1);
        expect(result.current.thisGamesUsers[0]).toEqual(mockAllUsers[1]);
        expect(result.current.hostUserId).toBe(mockAllUsers[1].user_id);
    });

    it("handles ready users that are not in the game", () => {
        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            readyUsers: [
                mockAllUsers[0].user_id,
                mockAllUsers[1].user_id,
                mockAllUsers[2].user_id,
                "random-user-id",
            ],
        };

        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        expect(result.current.allPlayersAreConnected).toBe(true);
    });

    it("returns all expected properties", () => {
        const { result } = renderHook(() => useLobbyHook(), {
            wrapper: createWrapper(),
        });

        expect(result.current).toHaveProperty("thisGamesUsers");
        expect(result.current).toHaveProperty("hostUserId");
        expect(result.current).toHaveProperty("loggedInUserIsHost");
        expect(result.current).toHaveProperty("allPlayersAreConnected");
        expect(result.current).toHaveProperty("isGameReady");
        expect(result.current).toHaveProperty("gameData");
    });
});
