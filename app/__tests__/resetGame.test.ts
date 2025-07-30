import { createClient } from "@/utils/supabase/client";
import { resetGame } from "../actions/resetGame";

jest.mock("@/utils/supabase/client");

const createClientMock = createClient as jest.Mock;

describe("resetGame", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("successfully resets game by deleting rankings, game_questions and updating game status", async () => {
        const gameId = 123;

        const mockEq = jest.fn().mockResolvedValue({ error: null });
        const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({
            delete: mockDelete,
            update: mockUpdate,
        });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await resetGame(gameId);

        expect(result).toBe(true);
        expect(createClient).toHaveBeenCalled();
    });

    it("throws error when rankings deletion fails", async () => {
        const gameId = 123;
        const mockError = { message: "Database error" };

        let callCount = 0;
        const mockEq = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({ error: mockError });
            }
            return Promise.resolve({ error: null });
        });

        const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({
            delete: mockDelete,
            update: mockUpdate,
        });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(resetGame(gameId)).rejects.toThrow(
            `Failed to reset game with id ${gameId}`
        );
    });

    it("throws error when game_questions deletion fails", async () => {
        const gameId = 456;
        const mockError = { message: "Foreign key constraint error" };

        let callCount = 0;
        const mockEq = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 2) {
                return Promise.resolve({ error: mockError });
            }
            return Promise.resolve({ error: null });
        });

        const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({
            delete: mockDelete,
            update: mockUpdate,
        });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(resetGame(gameId)).rejects.toThrow(
            `Failed to reset game with id ${gameId}`
        );
    });

    it("throws error when pre_answers deletion fails", async () => {
        const gameId = 456;
        const mockError = { message: "Foreign key constraint error" };

        let callCount = 0;
        const mockEq = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 3) {
                return Promise.resolve({ error: mockError });
            }
            return Promise.resolve({ error: null });
        });

        const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({
            delete: mockDelete,
            update: mockUpdate,
        });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(resetGame(gameId)).rejects.toThrow(
            `Failed to reset game with id ${gameId}`
        );
    });

    it("throws error when game status update fails", async () => {
        const gameId = 789;
        const mockError = { message: "Update failed" };

        let callCount = 0;
        const mockEq = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 3) {
                return Promise.resolve({ error: mockError });
            }
            return Promise.resolve({ error: null });
        });

        const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({
            delete: mockDelete,
            update: mockUpdate,
        });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(resetGame(gameId)).rejects.toThrow(
            `Failed to reset game with id ${gameId}`
        );
    });

    it("handles edge case with zero game ID", async () => {
        const gameId = 0;

        const mockEq = jest.fn().mockResolvedValue({ error: null });
        const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({
            delete: mockDelete,
            update: mockUpdate,
        });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await resetGame(gameId);

        expect(result).toBe(true);
    });
});
