import { createClient } from "@/utils/supabase/client";
import { insertGame } from "../actions/insertGame";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createForm = (
    hostValue: string | undefined,
    shareCodeValue: string | undefined,
    aiBotsValue: string | undefined,
    questionDurationValue: string | undefined,
    rankingDurationValue: string | undefined
) => {
    const form = document.createElement("form");
    form.id = "add-game-form";

    if (hostValue) {
        const hostInput = document.createElement("select");
        hostInput.id = "host-input";
        const option = document.createElement("option");
        option.value = hostValue;
        option.text = hostValue;
        hostInput.appendChild(option);
        hostInput.value = hostValue;
        form.appendChild(hostInput);
    }
    if (shareCodeValue) {
        const shareCodeInput = document.createElement("input");
        shareCodeInput.id = "share-code-input";
        shareCodeInput.value = shareCodeValue;
        form.appendChild(shareCodeInput);
    }
    if (aiBotsValue) {
        const aiBotsInput = document.createElement("select");
        aiBotsInput.id = "ai-bots-input";
        const option = document.createElement("option");
        option.value = aiBotsValue;
        option.text = aiBotsValue;
        aiBotsInput.appendChild(option);
        aiBotsInput.value = aiBotsValue;
        form.appendChild(aiBotsInput);
    }
    if (questionDurationValue) {
        const questionDurationInput = document.createElement("select");
        questionDurationInput.id = "question-duration-input";
        const option = document.createElement("option");
        option.value = questionDurationValue;
        option.text = questionDurationValue;
        questionDurationInput.appendChild(option);
        questionDurationInput.value = questionDurationValue;
        form.appendChild(questionDurationInput);
    }
    if (rankingDurationValue) {
        const rankingDurationInput = document.createElement("select");
        rankingDurationInput.id = "ranking-duration-input";
        const option = document.createElement("option");
        option.value = rankingDurationValue;
        option.text = rankingDurationValue;
        rankingDurationInput.appendChild(option);
        rankingDurationInput.value = rankingDurationValue;
        form.appendChild(rankingDurationInput);
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

describe("insertGame", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    it("should insert a game into the database", async () => {
        createForm("host1", "SHARE123", "2", "60", "90");
        const { mockFrom, mockInsert, mockSelect, mockSingle } =
            setupSupabaseMock({ data: { id: 1 }, error: null, status: 201 });

        const result = await insertGame();
        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockInsert).toHaveBeenCalledWith({
            host_user_id: "host1",
            num_static_ai: 2,
            seconds_per_pre: 60,
            seconds_per_rank: 90,
            share_code: "SHARE123",
        });
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(result).toEqual({ id: 1 });
    });

    it("should throw an error if the insertion fails", async () => {
        createForm("host1", "SHARE123", "2", "60", "90");
        setupSupabaseMock({
            data: null,
            error: new Error("error from supabase"),
            status: 400,
        });
        await expect(insertGame()).rejects.toThrow("error from supabase");
    });

    it("should throw a generic error if the insertion fails with no message", async () => {
        createForm("host1", "SHARE123", "2", "60", "90");
        setupSupabaseMock({
            data: null,
            error: new Error(),
            status: 400,
        });
        await expect(insertGame()).rejects.toThrow("Failed to insert game");
    });

    it("should throw if the form is not found", async () => {
        document.getElementById = jest.fn(() => null);
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the host input is not found", async () => {
        createForm(undefined, "SHARE123", "2", "60", "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the share code input is not found", async () => {
        createForm("host1", undefined, "2", "60", "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the ai bots input is not found", async () => {
        createForm("host1", "SHARE123", undefined, "60", "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the question duration input is not found", async () => {
        createForm("host1", "SHARE123", "2", undefined, "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the ranking duration input is not found", async () => {
        createForm("host1", "SHARE123", "2", "60", undefined);
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });
});
