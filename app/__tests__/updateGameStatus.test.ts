import { createClient } from "@/utils/supabase/client";
import { updateGameStatus } from "../actions/updateGameStatus";

jest.mock("@/utils/supabase/client");

const createClientMock = createClient as jest.Mock;

describe("updateGameStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("successfully updates game status and returns true", async () => {
        const mockGameData = {
            id: 42,
            created_at: "2023-10-01T00:00:00Z",
            updated_at: "2023-10-01T00:00:00Z",
            share_code: "SHRCDE",
            status: 1,
            num_static_ai: 2,
            seconds_per_pre: 30,
            seconds_per_rank: 60,
        };

        const mockSingle = jest.fn().mockResolvedValue({
            data: mockGameData,
            error: null,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await updateGameStatus(42, 1);

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockUpdate).toHaveBeenCalledWith({ status: 1 });
        expect(mockEq).toHaveBeenCalledWith("id", 42);
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it("updates game status to 0 (lobby)", async () => {
        const mockGameData = {
            id: 123,
            status: 0,
        };

        const mockSingle = jest.fn().mockResolvedValue({
            data: mockGameData,
            error: null,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await updateGameStatus(123, 0);

        expect(mockUpdate).toHaveBeenCalledWith({ status: 0 });
        expect(mockEq).toHaveBeenCalledWith("id", 123);
        expect(result).toBe(true);
    });

    it("updates game status to 2 (completed)", async () => {
        const mockGameData = {
            id: 456,
            status: 2,
        };

        const mockSingle = jest.fn().mockResolvedValue({
            data: mockGameData,
            error: null,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await updateGameStatus(456, 2);

        expect(mockUpdate).toHaveBeenCalledWith({ status: 2 });
        expect(mockEq).toHaveBeenCalledWith("id", 456);
        expect(result).toBe(true);
    });

    it("throws error when database update fails", async () => {
        const mockError = { message: "Database update failed" };

        const mockSingle = jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(updateGameStatus(42, 1)).rejects.toThrow(
            "Failed to edit game with id 42"
        );
    });

    it("throws error when no data is returned", async () => {
        const mockSingle = jest.fn().mockResolvedValue({
            data: null,
            error: null,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(updateGameStatus(999, 1)).rejects.toThrow(
            "Failed to edit game with id 999"
        );
    });

    it("handles different game IDs correctly", async () => {
        const gameIds = [1, 100, 9999];

        for (const gameId of gameIds) {
            const mockGameData = { id: gameId, status: 1 };

            const mockSingle = jest.fn().mockResolvedValue({
                data: mockGameData,
                error: null,
            });
            const mockSelect = jest
                .fn()
                .mockReturnValue({ single: mockSingle });
            const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
            const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
            const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

            createClientMock.mockReturnValue({ from: mockFrom });

            const result = await updateGameStatus(gameId, 1);

            expect(mockEq).toHaveBeenCalledWith("id", gameId);
            expect(result).toBe(true);

            jest.clearAllMocks();
        }
    });

    it("handles different status values correctly", async () => {
        const statuses = [0, 1, 2];

        for (const status of statuses) {
            const mockGameData = { id: 123, status };

            const mockSingle = jest.fn().mockResolvedValue({
                data: mockGameData,
                error: null,
            });
            const mockSelect = jest
                .fn()
                .mockReturnValue({ single: mockSingle });
            const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
            const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
            const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

            createClientMock.mockReturnValue({ from: mockFrom });

            const result = await updateGameStatus(123, status);

            expect(mockUpdate).toHaveBeenCalledWith({ status });
            expect(result).toBe(true);

            jest.clearAllMocks();
        }
    });
});
