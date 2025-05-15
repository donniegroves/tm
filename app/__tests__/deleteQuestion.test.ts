import { createClient } from "@/utils/supabase/server";
import { deleteQuestion } from "../actions/deleteQuestion";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

describe("deleteQuestion", () => {
    it("should delete a question in the database", async () => {
        const mockEq = jest
            .fn()
            .mockResolvedValue({ status: 204, error: null });
        const mockDelete = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ delete: mockDelete }));
        const mockSupabase = { from: mockFrom };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await deleteQuestion(123);

        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", 123);
    });

    it("should throw an error if the deletion fails", async () => {
        const mockEq = jest.fn().mockResolvedValue({
            status: 400,
            error: new Error("Deletion failed"),
        });
        const mockDelete = jest.fn(() => ({ eq: mockEq }));
        const mockFrom = jest.fn(() => ({ delete: mockDelete }));
        const mockSupabase = { from: mockFrom };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(deleteQuestion(345)).rejects.toThrow();

        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", 345);
    });
});
