import { renderHook } from "@testing-library/react";
import {
    getGameUserIdsInDeterministicOrder,
    getStatusUsingShareCode,
} from "../helpers";
import { useIsMaster } from "../hooks/useIsMaster";
import { useInsideContext } from "../inside/InsideContext";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";
import { createWrapper } from "./helpers/createWrapper";
import {
    mockAllUsers,
    mockGamesData,
    mockGameUsersData,
} from "./helpers/helpers";

jest.mock("../helpers", () => ({
    getStatusUsingShareCode: jest.fn(),
    getGameUserIdsInDeterministicOrder: jest.fn(),
}));

jest.mock("../inside/InsideContext");
jest.mock("../play/[share_code]/RealtimeContext");

const mockGetStatusUsingShareCode = getStatusUsingShareCode as jest.Mock;
const mockGetGameUserIdsInDeterministicOrder =
    getGameUserIdsInDeterministicOrder as jest.Mock;
const mockUseInsideContext = useInsideContext as jest.Mock;
const mockUseRealtimeContext = useRealtimeContext as jest.Mock;

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
                share_code: undefined,
            },
        });

        renderHook(() => useIsMaster(), {
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
