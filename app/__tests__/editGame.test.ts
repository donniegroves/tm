import { createClient } from "@/utils/supabase/client";
import { editGame } from "../actions/editGame";
import { Database } from "database.types";
import { PostgrestError } from "@supabase/supabase-js";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createForm = (
    gameIdValue: string | undefined,
    hostValue: string | undefined,
    inviteesValue: string | undefined,
    shareCodeValue: string | undefined,
    aiBotsValue: string | undefined,
    questionDurationValue: string | undefined,
    rankingDurationValue: string | undefined
) => {
    const form = document.createElement("form");
    form.id = "edit-game-form";

    const addInput = (id: string, value: string) => {
        const input = document.createElement("input");
        input.id = id;
        input.value = value;
        form.appendChild(input);
    };
    if (gameIdValue) addInput("game-id-input", gameIdValue);
    if (hostValue) addInput("host-input", hostValue);
    if (inviteesValue) addInput("invitees-input", inviteesValue);
    if (shareCodeValue) addInput("share-code-input", shareCodeValue);
    if (aiBotsValue) addInput("ai-bots-input", aiBotsValue);
    if (questionDurationValue)
        addInput("question-duration-input", questionDurationValue);
    if (rankingDurationValue)
        addInput("ranking-duration-input", rankingDurationValue);
    document.body.appendChild(form);
    return form;
};

const setupSupabaseMock = (
    mockUpdateResult: {
        data: Database["public"]["Tables"]["games"]["Row"] | null;
        error: PostgrestError | null;
    },
    mockDeleteResult: { error: PostgrestError | null },
    mockInsertResult: {
        data: Database["public"]["Tables"]["game_users"]["Row"][] | null;
        error: PostgrestError | null;
    }
) => {
    const mockSingle = jest.fn().mockResolvedValue(mockUpdateResult);
    const mockSelect = jest.fn(() => ({ single: mockSingle }));
    const mockEqUpdate = jest.fn(() => ({ select: mockSelect }));
    const mockUpdate = jest.fn(() => ({ eq: mockEqUpdate }));

    const mockDelete = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue(mockDeleteResult),
    }));
    const mockInsert = jest.fn(() => ({
        select: jest.fn().mockResolvedValue(mockInsertResult),
    }));
    const mockFrom = jest.fn((table: string) => {
        if (table === "games") return { update: mockUpdate };
        if (table === "game_users")
            return { delete: mockDelete, insert: mockInsert };
        return {};
    });
    const mockSupabase = { from: mockFrom };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    return {
        mockFrom,
        mockUpdate,
        mockEqUpdate,
        mockSelect,
        mockSingle,
        mockDelete,
        mockInsert,
    };
};

describe("editGame", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    it("should update a game and its invitees in the database", async () => {
        createForm("42", "host1", "user2,user3", "SHRCDE", "2", "30", "60");
        const {
            mockFrom,
            mockUpdate,
            mockEqUpdate,
            mockSelect,
            mockSingle,
            mockDelete,
            mockInsert,
        } = setupSupabaseMock(
            {
                data: {
                    id: 42,
                    created_at: "2023-10-01T00:00:00Z",
                    updated_at: "2023-10-01T00:00:00Z",
                    host_user_id: "host1",
                    share_code: "SHRCDE",
                    num_static_ai: 2,
                    seconds_per_pre: 30,
                    seconds_per_rank: 60,
                },
                error: null,
            },
            { error: null },
            {
                data: [
                    {
                        game_id: 42,
                        user_id: "user2",
                        created_at: "2023-10-01T00:00:00Z",
                        updated_at: "2023-10-01T00:00:00Z",
                    },
                    {
                        game_id: 42,
                        user_id: "user3",
                        created_at: "2023-10-01T00:00:00Z",
                        updated_at: "2023-10-01T00:00:00Z",
                    },
                ],
                error: null,
            }
        );

        const result = await editGame();
        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockUpdate).toHaveBeenCalledWith({
            host_user_id: "host1",
            share_code: "SHRCDE",
            num_static_ai: 2,
            seconds_per_pre: 30,
            seconds_per_rank: 60,
        });
        expect(mockEqUpdate).toHaveBeenCalledWith("id", 42);
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("game_users");
        expect(mockDelete).toHaveBeenCalled();
        expect(mockInsert).toHaveBeenCalledWith([
            { game_id: 42, user_id: "user2" },
            { game_id: 42, user_id: "user3" },
        ]);
        expect(result).toEqual({
            gameData: {
                created_at: "2023-10-01T00:00:00Z",
                host_user_id: "host1",
                id: 42,
                num_static_ai: 2,
                seconds_per_pre: 30,
                seconds_per_rank: 60,
                share_code: "SHRCDE",
                updated_at: "2023-10-01T00:00:00Z",
            },
            gameUsersData: [
                {
                    game_id: 42,
                    user_id: "user2",
                    created_at: "2023-10-01T00:00:00Z",
                    updated_at: "2023-10-01T00:00:00Z",
                },
                {
                    game_id: 42,
                    user_id: "user3",
                    created_at: "2023-10-01T00:00:00Z",
                    updated_at: "2023-10-01T00:00:00Z",
                },
            ],
        });
    });

    it("should throw an error if the update fails", async () => {
        createForm("42", "host1", "user2", "SHRCDE", "2", "30", "60");
        setupSupabaseMock(
            {
                data: null,
                error: {
                    message: "update error",
                    details: "Failed to update game",
                    hint: "",
                    code: "400",
                } as PostgrestError,
            },
            { error: null },
            { data: [], error: null }
        );
        await expect(editGame()).rejects.toThrow(
            "Failed to edit game with id 42"
        );
    });

    it("should throw an error if the delete invitees fails", async () => {
        createForm("42", "host1", "user2", "SHRCDE", "2", "30", "60");
        setupSupabaseMock(
            {
                data: {
                    id: 42,
                    created_at: "2023-10-01T00:00:00Z",
                    updated_at: "2023-10-01T00:00:00Z",
                    host_user_id: "host1",
                    share_code: "SHRCDE",
                    num_static_ai: 2,
                    seconds_per_pre: 30,
                    seconds_per_rank: 60,
                },
                error: null,
            },
            {
                error: {
                    message: "delete error",
                    details: "Failed to delete game",
                    hint: "",
                    code: "400",
                } as PostgrestError,
            },
            { data: [], error: null }
        );
        await expect(editGame()).rejects.toThrow(
            "Failed to delete invitees for game with id 42"
        );
    });

    it("should throw an error if the insert invitees fails", async () => {
        createForm("42", "host1", "user2", "SHRCDE", "2", "30", "60");
        setupSupabaseMock(
            {
                data: {
                    id: 42,
                    created_at: "2023-10-01T00:00:00Z",
                    updated_at: "2023-10-01T00:00:00Z",
                    host_user_id: "host1",
                    share_code: "SHRCDE",
                    num_static_ai: 2,
                    seconds_per_pre: 30,
                    seconds_per_rank: 60,
                },
                error: null,
            },
            { error: null },
            {
                data: null,
                error: {
                    message: "insert error",
                    details: "Failed to insert game",
                    hint: "",
                    code: "400",
                } as PostgrestError,
            }
        );
        await expect(editGame()).rejects.toThrow(
            "Failed to add invitees for game with id 42"
        );
    });

    it("should throw if the form is not found", async () => {
        document.getElementById = jest.fn(() => null);
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
    });

    it("should throw if any required input is missing", async () => {
        createForm(undefined, "host1", "user2", "SHRCDE", "2", "30", "60");
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
        createForm("42", undefined, "user2", "SHRCDE", "2", "30", "60");
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
        createForm("42", "host1", undefined, "SHRCDE", "2", "30", "60");
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
        createForm("42", "host1", "user2", undefined, "2", "30", "60");
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
        createForm("42", "host1", "user2", "SHRCDE", undefined, "30", "60");
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
        createForm("42", "host1", "user2", "SHRCDE", "2", undefined, "60");
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
        createForm("42", "host1", "user2", "SHRCDE", "2", "30", undefined);
        await expect(editGame()).rejects.toThrow(
            "Proper form elements not found to edit game"
        );
    });
});
