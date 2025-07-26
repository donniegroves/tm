import { renderHook, waitFor } from "@testing-library/react";
import { resetGame } from "../actions/resetGame";
import { useResetGame } from "../hooks/useResetGame";
import { createWrapper } from "./helpers/createWrapper";

jest.mock("../actions/resetGame");

const resetGameMock = resetGame as jest.MockedFunction<typeof resetGame>;

describe("useResetGame", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns a mutation object with correct properties", () => {
        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        expect(result.current).toHaveProperty("mutate");
        expect(result.current).toHaveProperty("mutateAsync");
        expect(result.current).toHaveProperty("isPending");
        expect(result.current).toHaveProperty("isError");
        expect(result.current).toHaveProperty("isSuccess");
        expect(result.current).toHaveProperty("data");
        expect(result.current).toHaveProperty("error");
    });

    it("has correct initial state", () => {
        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBe(null);
    });

    it("calls resetGame with correct parameters when mutated", async () => {
        resetGameMock.mockResolvedValue(true);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        const gameId = 123;
        result.current.mutate({ gameId });

        await waitFor(() => {
            expect(resetGameMock).toHaveBeenCalledWith(gameId);
        });
    });

    it("returns success state when mutation succeeds", async () => {
        resetGameMock.mockResolvedValue(true);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        result.current.mutate({ gameId: 123 });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("returns error state when mutation fails", async () => {
        const mockError = new Error("Reset failed");
        resetGameMock.mockRejectedValue(mockError);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        result.current.mutate({ gameId: 123 });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(mockError);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.data).toBeUndefined();
    });

    it("calls resetGame action correctly", async () => {
        resetGameMock.mockResolvedValue(true);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        const gameId = 456;
        result.current.mutate({ gameId });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(resetGameMock).toHaveBeenCalledTimes(1);
        expect(resetGameMock).toHaveBeenCalledWith(gameId);
    });

    it("handles different game IDs correctly", async () => {
        resetGameMock.mockResolvedValue(true);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        // Test with different game IDs
        const gameId1 = 999;
        const gameId2 = 0;

        result.current.mutate({ gameId: gameId1 });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(resetGameMock).toHaveBeenCalledWith(gameId1);

        // Reset for second test
        result.current.reset();

        result.current.mutate({ gameId: gameId2 });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(resetGameMock).toHaveBeenCalledWith(gameId2);
        expect(resetGameMock).toHaveBeenCalledTimes(2);
    });

    it("can be called multiple times", async () => {
        resetGameMock.mockResolvedValue(true);

        const wrapper = createWrapper();
        const { result } = renderHook(() => useResetGame(), { wrapper });

        // First call
        result.current.mutate({ gameId: 111 });
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        // Reset and call again
        result.current.reset();

        result.current.mutate({ gameId: 222 });
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(resetGameMock).toHaveBeenCalledTimes(2);
        expect(resetGameMock).toHaveBeenNthCalledWith(1, 111);
        expect(resetGameMock).toHaveBeenNthCalledWith(2, 222);
    });
});
