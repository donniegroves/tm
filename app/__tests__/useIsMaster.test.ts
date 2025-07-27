import { renderHook } from "@testing-library/react";
import { useIsMaster } from "../hooks/useIsMaster";
import { createWrapper } from "./helpers/createWrapper";
import {
    mockAllUsers,
    mockGamesData,
    mockGameUsersData,
} from "./helpers/helpers";

// Mock the helper functions
jest.mock("../helpers", () => ({
    getStatusUsingShareCode: jest.fn(),
    getGameUserIdsInDeterministicOrder: jest.fn(),
}));

// Mock the context hooks
jest.mock("../inside/InsideContext");
jest.mock("../play/[share_code]/RealtimeContext");

const mockGetStatusUsingShareCode = require("../helpers")
    .getStatusUsingShareCode as jest.Mock;
const mockGetGameUserIdsInDeterministicOrder = require("../helpers")
    .getGameUserIdsInDeterministicOrder as jest.Mock;
const mockUseInsideContext = require("../inside/InsideContext")
    .useInsideContext as jest.Mock;
const mockUseRealtimeContext = require("../play/[share_code]/RealtimeContext")
    .useRealtimeContext as jest.Mock;

describe("useIsMaster", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        //
        mockUseInsideContext.mockReturnValue({
            games: mockGamesData,
            gameUsers: mockGameUsersData,
            loggedInUserId: mockAllUsers[0].user_id,
        });

        mockUseRealtimeContext.mockReturnValue({
            gameData: mockGamesData[1],
        });

        mockGetStatusUsingShareCode.mockReturnValue({
            round: 1,
            status: "pre-question",
        });

        mockGetGameUserIdsInDeterministicOrder.mockReturnValue([
            mockAllUsers[0].user_id,
            mockAllUsers[2].user_id,
        ]);
    });

    it("handles round being null by defaulting to round 0", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        const { result } = renderHook(() => useIsMaster(), {
            wrapper: createWrapper(),
        });

        expect(result.current).toBe(false);
    });

    it("handles undefined gameData.share_code", () => {
        mockUseRealtimeContext.mockReturnValue({
            gameData: {
                ...mockGamesData[1],
                share_code: undefined as any,
            },
        });

        const { result } = renderHook(() => useIsMaster(), {
            wrapper: createWrapper(),
        });

        expect(mockGetGameUserIdsInDeterministicOrder).toHaveBeenCalledWith(
            mockGameUsersData,
            ""
        );
    });

    it("returns false when no users are in the master order", () => {
        mockGetGameUserIdsInDeterministicOrder.mockReturnValue([]);

        const { result } = renderHook(() => useIsMaster(), {
            wrapper: createWrapper(),
        });

        expect(result.current).toBe(false);
    });

    it("returns false when round exceeds available masters", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 5,
            status: "pre-question",
        });

        const { result } = renderHook(() => useIsMaster(), {
            wrapper: createWrapper(),
        });

        expect(result.current).toBe(false);
    });

    it("uses correct context values", () => {
        renderHook(() => useIsMaster(), {
            wrapper: createWrapper(),
        });

        expect(mockUseInsideContext).toHaveBeenCalledTimes(1);
        expect(mockUseRealtimeContext).toHaveBeenCalledTimes(1);
    });
});
