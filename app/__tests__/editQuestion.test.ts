import { createClient } from "@/utils/supabase/client";
import { editQuestion } from "../actions/editQuestion";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createForm = (
    questionIdValue: string | undefined,
    questionValue: string | undefined,
    rankPromptValue: string | undefined
) => {
    const form = document.createElement("form");
    form.id = "edit-question-form";

    if (questionIdValue) {
        const questionIdInput = document.createElement("input");
        questionIdInput.id = "question-id-input";
        questionIdInput.value = questionIdValue;
        form.appendChild(questionIdInput);
    }
    if (questionValue) {
        const questionInput = document.createElement("input");
        questionInput.id = "edit-question-input";
        questionInput.value = questionValue;
        form.appendChild(questionInput);
    }
    if (rankPromptValue) {
        const rankPromptInput = document.createElement("input");
        rankPromptInput.id = "edit-rank-prompt-input";
        rankPromptInput.value = rankPromptValue;
        form.appendChild(rankPromptInput);
    }
    document.body.appendChild(form);
    return form;
};

const setupSupabaseMock = (mockSingleResult: unknown) => {
    const mockSingle = jest.fn().mockResolvedValue(mockSingleResult);
    const mockSelect = jest.fn(() => ({ single: mockSingle }));
    const mockEq = jest.fn(() => ({ select: mockSelect }));
    const mockUpdate = jest.fn(() => ({ eq: mockEq }));
    const mockFrom = jest.fn(() => ({ update: mockUpdate }));
    const mockSupabase = { from: mockFrom };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    return { mockFrom, mockUpdate, mockEq, mockSelect, mockSingle };
};

describe("editQuestion", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    it("should update a question in the database", async () => {
        createForm(
            "42",
            "What is your favorite color?",
            "Rank your preferences."
        );
        const { mockFrom, mockUpdate, mockEq, mockSelect, mockSingle } =
            setupSupabaseMock({ data: { id: 42 }, error: null });

        const result = await editQuestion();
        expect(mockFrom).toHaveBeenCalledWith("questions");
        expect(mockUpdate).toHaveBeenCalledWith({
            pre_question: "What is your favorite color?",
            rank_prompt: "Rank your preferences.",
        });
        expect(mockEq).toHaveBeenCalledWith("id", 42);
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(result).toEqual({ id: 42 });
    });

    it("should throw an error if the update fails", async () => {
        createForm(
            "42",
            "What is your favorite color?",
            "Rank your preferences."
        );
        setupSupabaseMock({
            data: null,
            error: new Error("error from supabase"),
        });
        await expect(editQuestion()).rejects.toThrow("error from supabase");
    });

    it("should throw a generic error if the update fails with no message", async () => {
        createForm(
            "42",
            "What is your favorite color?",
            "Rank your preferences."
        );
        setupSupabaseMock({ data: null, error: new Error() });
        await expect(editQuestion()).rejects.toThrow(
            "Failed to edit question with id 42"
        );
    });

    it("should throw if the form is not found", async () => {
        document.getElementById = jest.fn(() => null);
        await expect(editQuestion()).rejects.toThrow(
            "Proper form elements not found to insert question"
        );
    });

    it("should throw if the question id input is not found", async () => {
        createForm(undefined, "Q", "R");
        setupSupabaseMock({ data: { id: 1 }, error: null });
        await expect(editQuestion()).rejects.toThrow(
            "Proper form elements not found to insert question"
        );
    });

    it("should throw if the question input is not found", async () => {
        createForm("42", undefined, "R");
        setupSupabaseMock({ data: { id: 1 }, error: null });
        await expect(editQuestion()).rejects.toThrow(
            "Proper form elements not found to insert question"
        );
    });

    it("should throw if the rank prompt input is not found", async () => {
        createForm("42", "Q", undefined);
        setupSupabaseMock({ data: { id: 1 }, error: null });
        await expect(editQuestion()).rejects.toThrow(
            "Proper form elements not found to insert question"
        );
    });
});
