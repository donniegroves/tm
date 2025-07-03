import { createClient } from "@/utils/supabase/client";
import { insertQuestion } from "../actions/insertQuestion";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createForm = (
    questionValue: string | undefined,
    rankPromptValue: string | undefined
) => {
    const form = document.createElement("form");
    form.id = "add-question-form";

    if (questionValue) {
        const questionInput = document.createElement("input");
        questionInput.id = "add-question-input";
        questionInput.value = questionValue;
        form.appendChild(questionInput);
    }

    if (rankPromptValue) {
        const rankPromptInput = document.createElement("input");
        rankPromptInput.id = "rank-prompt-input";
        rankPromptInput.value = rankPromptValue;
        form.appendChild(rankPromptInput);
    }

    document.body.appendChild(form);
    return form;
};

const setupSupabaseMock = (mockSingleResult: unknown) => {
    const mockSingle = jest.fn().mockResolvedValue(mockSingleResult);
    const mockSelect = jest.fn(() => ({ single: mockSingle }));
    const mockInsert = jest.fn(() => ({ select: mockSelect }));
    const mockFrom = jest.fn(() => ({ insert: mockInsert }));
    const mockSupabase = { from: mockFrom };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    return { mockFrom, mockInsert, mockSelect, mockSingle };
};

describe("insertQuestion", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    it("should insert a question into the database", async () => {
        createForm("What is your favorite color?", "Rank your preferences.");
        const { mockFrom, mockInsert, mockSelect, mockSingle } =
            setupSupabaseMock({ data: { id: 1 }, error: null, status: 201 });

        const result = await insertQuestion();
        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockInsert).toHaveBeenCalledWith({
            pre_question: "What is your favorite color?",
            rank_prompt: "Rank your preferences.",
        });
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(mockSingle).not.toThrow();
        expect(result).toEqual({ id: 1 });
    });

    it("should throw an error if the insertion fails", async () => {
        createForm("What is your favorite color?", "Rank your preferences.");
        const { mockFrom, mockInsert } = setupSupabaseMock({
            data: null,
            error: new Error("error from supabase"),
            status: 400,
        });

        await expect(insertQuestion()).rejects.toThrow("error from supabase");
        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockInsert).toHaveBeenCalledWith({
            pre_question: "What is your favorite color?",
            rank_prompt: "Rank your preferences.",
        });
    });

    it("should throw a generic error if the insertion fails with no message", async () => {
        createForm("What is your favorite color?", "Rank your preferences.");
        const { mockFrom, mockInsert } = setupSupabaseMock({
            data: null,
            error: new Error(),
            status: 400,
        });

        await expect(insertQuestion()).rejects.toThrow(
            "Failed to insert question"
        );
        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockInsert).toHaveBeenCalledWith({
            pre_question: "What is your favorite color?",
            rank_prompt: "Rank your preferences.",
        });
    });

    it("should throw if the form is not found", async () => {
        document.getElementById = jest.fn(() => null);
        await expect(insertQuestion()).rejects.toThrow(
            "Proper form elements not found to insert question"
        );
    });

    it("should throw if the question input is not found", async () => {
        createForm(undefined, "Rank your preferences.");
        setupSupabaseMock({ data: { id: 1 }, error: null, status: 201 });
        await expect(insertQuestion()).rejects.toThrow(
            "Proper form elements not found to insert question"
        );
    });

    it("should throw if the rank prompt input is not found", async () => {
        createForm("question here", undefined);
        setupSupabaseMock({ data: { id: 1 }, error: null, status: 201 });
        await expect(insertQuestion()).rejects.toThrow(
            "Proper form elements not found to insert question"
        );
    });
});
