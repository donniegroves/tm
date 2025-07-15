import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "database.types";
import { updateGameStatus } from "../actions/updateGameStatus";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const setupSupabaseMock = (mockUpdateResult: {
    data: Database["public"]["Tables"]["games"]["Row"] | null;
    error: PostgrestError | null;
}) => {
    const mockSingle = jest.fn().mockResolvedValue(mockUpdateResult);
    const mockSelect = jest.fn(() => ({ single: mockSingle }));
    const mockEq = jest.fn(() => ({ select: mockSelect }));
    const mockUpdate = jest.fn(() => ({ eq: mockEq }));
    const mockFrom = jest.fn(() => ({ update: mockUpdate }));
    const mockSupabase = { from: mockFrom };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    return {
        mockFrom,
        mockUpdate,
        mockEq,
        mockSelect,
        mockSingle,
    };
};

describe("updateGameStatus", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update a game status in the database", async () => {
        const gameData: Database["public"]["Tables"]["games"]["Row"] = {
            id: 42,
            created_at: "2023-10-01T00:00:00Z",
            updated_at: "2023-10-01T00:00:00Z",
            share_code: "SHRCDE",
            status: 1,
            num_static_ai: 2,
            seconds_per_pre: 30,
            seconds_per_rank: 60,
        };

        const { mockFrom, mockUpdate, mockEq, mockSelect, mockSingle } =
            setupSupabaseMock({
                data: gameData,
                error: null,
            });

        const result = await updateGameStatus(gameData);

        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockUpdate).toHaveBeenCalledWith({
            status: 1,
        });
        expect(mockEq).toHaveBeenCalledWith("id", 42);
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(result).toEqual({
            gameData: {
                id: 42,
                created_at: "2023-10-01T00:00:00Z",
                updated_at: "2023-10-01T00:00:00Z",
                share_code: "SHRCDE",
                status: 1,
                num_static_ai: 2,
                seconds_per_pre: 30,
                seconds_per_rank: 60,
            },
        });
    });

    it("should update game status to 0 (lobby)", async () => {
        const gameData: Database["public"]["Tables"]["games"]["Row"] = {
            id: 123,
            created_at: "2023-10-01T00:00:00Z",
            updated_at: "2023-10-01T00:00:00Z",
            share_code: "ABCDEF",
            status: 0,
            num_static_ai: 1,
            seconds_per_pre: 45,
            seconds_per_rank: 90,
        };

        const { mockFrom, mockUpdate, mockEq } = setupSupabaseMock({
            data: gameData,
            error: null,
        });

        await updateGameStatus(gameData);

        expect(mockFrom).toHaveBeenCalledWith("games");
        expect(mockUpdate).toHaveBeenCalledWith({
            status: 0,
        });
        expect(mockEq).toHaveBeenCalledWith("id", 123);
    });

    it("should update game status to 2 (completed)", async () => {
        const gameData: Database["public"]["Tables"]["games"]["Row"] = {
            id: 456,
            created_at: "2023-10-01T00:00:00Z",
            updated_at: "2023-10-01T00:00:00Z",
            share_code: "GHIJKL",
            status: 2,
            num_static_ai: 0,
            seconds_per_pre: 60,
            seconds_per_rank: 120,
        };

        const { mockUpdate, mockEq } = setupSupabaseMock({
            data: gameData,
            error: null,
        });

        await updateGameStatus(gameData);

        expect(mockUpdate).toHaveBeenCalledWith({
            status: 2,
        });
        expect(mockEq).toHaveBeenCalledWith("id", 456);
    });

    it("should throw an error if the update fails due to database error", async () => {
        const gameData: Database["public"]["Tables"]["games"]["Row"] = {
            id: 42,
            created_at: "2023-10-01T00:00:00Z",
            updated_at: "2023-10-01T00:00:00Z",
            share_code: "SHRCDE",
            status: 1,
            num_static_ai: 2,
            seconds_per_pre: 30,
            seconds_per_rank: 60,
        };

        setupSupabaseMock({
            data: null,
            error: {
                message: "update error",
                details: "Failed to update game",
                hint: "",
                code: "400",
            } as PostgrestError,
        });

        await expect(updateGameStatus(gameData)).rejects.toThrow(
            "Failed to edit game with id 42"
        );
    });

    it("should throw an error if no data is returned", async () => {
        const gameData: Database["public"]["Tables"]["games"]["Row"] = {
            id: 999,
            created_at: "2023-10-01T00:00:00Z",
            updated_at: "2023-10-01T00:00:00Z",
            share_code: "NOTFND",
            status: 1,
            num_static_ai: 0,
            seconds_per_pre: 30,
            seconds_per_rank: 60,
        };

        setupSupabaseMock({
            data: null,
            error: null,
        });

        await expect(updateGameStatus(gameData)).rejects.toThrow(
            "Failed to edit game with id 999"
        );
    });
});
