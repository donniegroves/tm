import { createClient } from "@/utils/supabase/client";
import { insertGame } from "../actions/insertGame";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createForm = (
    hostValue: string | undefined,
    inviteesValue: string | undefined,
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
    if (inviteesValue) {
        const inviteesInput = document.createElement("select");
        inviteesInput.id = "invitees-input";
        const option = document.createElement("option");
        option.value = inviteesValue;
        option.text = inviteesValue;
        inviteesInput.appendChild(option);
        inviteesInput.value = inviteesValue;
        form.appendChild(inviteesInput);
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

const setupSupabaseMock = (
    mockGameSingleResult: unknown,
    mockInviteeInsertResult: unknown = { data: [{}], error: null, status: 201 }
) => {
    const mockGameSingle = jest.fn().mockResolvedValue(mockGameSingleResult);
    const mockGameSelect = jest.fn(() => ({ single: mockGameSingle }));
    const mockGameInsert = jest.fn(() => ({ select: mockGameSelect }));

    const mockInviteeInsert = jest
        .fn()
        .mockResolvedValue(mockInviteeInsertResult);

    const mockFrom = jest.fn((table: string) => {
        if (table === "games") {
            return { insert: mockGameInsert };
        }
        if (table === "game_users") {
            return { insert: mockInviteeInsert };
        }
        throw new Error("Unknown table: " + table);
    });

    const mockSupabase = { from: mockFrom };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    return {
        mockFrom,
        mockGameInsert,
        mockGameSelect,
        mockGameSingle,
        mockInviteeInsert,
    };
};

describe("insertGame", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should insert a game into the database", async () => {
        createForm("host1", "invitee1", "SHARE123", "2", "60", "90");
        const { mockFrom, mockGameInsert } = setupSupabaseMock(
            { data: { id: 1 }, error: null, status: 201 },
            { data: [{}], error: null, status: 201 }
        );

        const result = await insertGame();
        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockGameInsert).toHaveBeenCalledWith({
            host_user_id: "host1",
            num_static_ai: 2,
            seconds_per_pre: 60,
            seconds_per_rank: 90,
            share_code: "SHARE123",
        });
        expect(result).toEqual({ id: 1 });
    });

    it("should throw an error if the insertion fails", async () => {
        createForm("host1", "invitee1", "SHARE123", "2", "60", "90");
        setupSupabaseMock({
            data: null,
            error: new Error("error from supabase"),
            status: 400,
        });
        await expect(insertGame()).rejects.toThrow("Failed to insert game");
    });

    it("should throw a generic error if the insertion fails with no message", async () => {
        createForm("host1", "invitee1", "SHARE123", "2", "60", "90");
        setupSupabaseMock({
            data: null,
            error: new Error(),
            status: 400,
        });
        await expect(insertGame()).rejects.toThrow("Failed to insert game");
    });

    it("should throw if the host input is not found", async () => {
        createForm(undefined, "invitee1", "SHARE123", "2", "60", "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the share code input is not found", async () => {
        createForm("host1", "invitee1", undefined, "2", "60", "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the ai bots input is not found", async () => {
        createForm("host1", "invitee1", "SHARE123", undefined, "60", "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the question duration input is not found", async () => {
        createForm("host1", "invitee1", "SHARE123", "2", undefined, "90");
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });

    it("should throw if the ranking duration input is not found", async () => {
        createForm("host1", "invitee1", "SHARE123", "2", "60", undefined);
        await expect(insertGame()).rejects.toThrow(
            "Proper form elements not found to insert game"
        );
    });
    it("should throw if invitee call fails", async () => {
        createForm("host1", "invitee1", "SHARE123", "2", "60", "90");
        const { mockFrom, mockInviteeInsert } = setupSupabaseMock(
            { data: { id: 1 }, error: null, status: 201 },
            { data: null, error: new Error("error from supabase"), status: 400 }
        );

        await expect(insertGame()).rejects.toThrow("Failed to insert invitees");

        expect(mockFrom).toHaveBeenCalledWith("game_users");
        expect(mockInviteeInsert).toHaveBeenCalledWith([
            {
                game_id: 1,
                user_id: "invitee1",
            },
        ]);
    });
});
