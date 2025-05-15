import { createClient } from "@/utils/supabase/server";
import { insertQuestion } from "../actions/insertQuestion";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

describe("insertQuestion", () => {
    it("should insert a question into the database", async () => {
        const mockInsert = jest
            .fn()
            .mockResolvedValue({ status: 201, error: null });
        const mockSupabase = {
            from: jest.fn(() => ({ insert: mockInsert })),
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await insertQuestion(
            "What is your favorite color?",
            "Rank your preferences"
        );

        expect(mockSupabase.from).toHaveBeenCalledWith("questions");
        expect(mockInsert).toHaveBeenCalledWith({
            pre_question: "What is your favorite color?",
            rank_prompt: "Rank your preferences",
        });
    });

    it("should throw an error if the insertion fails", async () => {
        const mockInsert = jest.fn().mockResolvedValue({
            status: 400,
            error: new Error("Insertion failed"),
        });
        const mockSupabase = {
            from: jest.fn(() => ({ insert: mockInsert })),
        };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(
            insertQuestion(
                "What is your favorite color?",
                "Rank your preferences"
            )
        ).rejects.toThrow();

        expect(mockSupabase.from).toHaveBeenCalledWith("questions");
        expect(mockInsert).toHaveBeenCalledWith({
            pre_question: "What is your favorite color?",
            rank_prompt: "Rank your preferences",
        });
    });
});
