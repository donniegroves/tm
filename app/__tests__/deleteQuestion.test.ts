import { createClient } from "@/utils/supabase/client";
import { deleteQuestion } from "../actions/deleteQuestion";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createClientMock = createClient as jest.Mock;

describe("deleteQuestion", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });

    it("should delete a question in the database", async () => {
        const mockEq = jest
            .fn()
            .mockResolvedValue({ status: 204, error: null });
        const mockDelete = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ delete: mockDelete }));
        const mockSupabase = { from: mockFrom };
        createClientMock.mockReturnValue(mockSupabase);

        await deleteQuestion({ questionId: 123 });

        expect(mockFrom).toHaveBeenCalledWith("questions");
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

        await expect(deleteQuestion({ questionId: 456 })).rejects.toThrow(
            "fail"
        );
        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", 456);
    });

    it("should throw an error with a message of 'Failed to delete question with id 789'", async () => {
        const mockEq = jest.fn().mockResolvedValue({
            status: 500,
            error: new Error(),
        });
        const mockDelete = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ delete: mockDelete }));
        const mockSupabase = { from: mockFrom };
        createClientMock.mockReturnValue(mockSupabase);

        await expect(deleteQuestion({ questionId: 789 })).rejects.toThrow(
            "Failed to delete question with id 789"
        );
        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", 789);
    });
});
