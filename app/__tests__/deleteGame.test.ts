import { createClient } from "@/utils/supabase/client";
import { deleteGame } from "../actions/deleteGame";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createClientMock = createClient as jest.Mock;

describe("deleteGame", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });

    it("should delete a game in the database", async () => {
        const mockEq = jest
            .fn()
            .mockResolvedValue({ status: 204, error: null });
        const mockDelete = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ delete: mockDelete }));
        const mockSupabase = { from: mockFrom };
        createClientMock.mockReturnValue(mockSupabase);

        await deleteGame({ gameId: 123 });

        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", 123);
    });

    it("should throw an error with a message of 'fail'", async () => {
        const mockEq = jest
            .fn()
            .mockResolvedValue({ status: 400, error: new Error("fail") });
        const mockDelete = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ delete: mockDelete }));
        const mockSupabase = { from: mockFrom };
        createClientMock.mockReturnValue(mockSupabase);

        await expect(deleteGame({ gameId: 456 })).rejects.toThrow("fail");
        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", 456);
    });

    it("should throw an error with a message of 'Failed to delete game with id 789'", async () => {
        const mockEq = jest.fn().mockResolvedValue({
            status: 500,
            error: new Error(),
        });
        const mockDelete = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ delete: mockDelete }));
        const mockSupabase = { from: mockFrom };
        createClientMock.mockReturnValue(mockSupabase);

        await expect(deleteGame({ gameId: 789 })).rejects.toThrow(
            "Failed to delete game with id 789"
        );
        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", 789);
    });
});
