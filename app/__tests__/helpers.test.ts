import { createClient } from "@/utils/supabase/server";
import { Database } from "database.types";
import {
    fetchLayoutData,
    getUserFromPublic,
    mapAuthUserRowToPublicUserRow,
} from "../helpers";
import {
    mockAuthUserRow,
    mockPublicGameRow,
    mockPublicQuestionRow,
    mockPublicUserRow,
} from "../test-helpers";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

describe("helpers", () => {
    let mockSupabase: {
        from: jest.Mock;
        select: jest.Mock;
        eq: jest.Mock;
        maybeSingle: jest.Mock;
        auth: {
            getUser: jest.Mock;
        };
    };

    beforeEach(() => {
        mockSupabase = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn(),
            auth: {
                getUser: jest.fn(),
            },
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserFromPublic", () => {
        it("should return user data if found", async () => {
            mockSupabase.maybeSingle.mockResolvedValue({
                data: mockPublicUserRow,
                error: null,
            });

            const result = await getUserFromPublic(mockPublicUserRow.user_id);

            expect(mockSupabase.from).toHaveBeenCalledWith("users");
            expect(mockSupabase.select).toHaveBeenCalled();
            expect(mockSupabase.eq).toHaveBeenCalledWith(
                "user_id",
                mockPublicUserRow.user_id
            );
            expect(result).toEqual(mockPublicUserRow);
        });

        it("should throw an error if there is an error fetching user data", async () => {
            const mockUserId = "123";

            mockSupabase.maybeSingle.mockResolvedValue({
                data: null,
                error: "Error",
            });

            await expect(getUserFromPublic(mockUserId)).rejects.toThrow(
                "Error checking existing user"
            );
        });
    });

    describe("fetchLayoutData", () => {
        it("should return layout data if successful", async () => {
            const mockAllUsers: Database["public"]["Tables"]["users"]["Row"][] =
                [mockPublicUserRow, { ...mockPublicUserRow, user_id: "user2" }];
            const mockGamesData: Database["public"]["Tables"]["games"]["Row"][] =
                [mockPublicGameRow, { ...mockPublicGameRow, id: 222 }];
            const mockQuestionsData: Database["public"]["Tables"]["questions"]["Row"][] =
                [mockPublicQuestionRow, { ...mockPublicQuestionRow, id: 373 }];

            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUserRow },
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: mockAllUsers,
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: mockGamesData,
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: mockQuestionsData,
                error: null,
            });

            const result = await fetchLayoutData();

            expect(mockSupabase.auth.getUser).toHaveBeenCalled();
            expect(mockSupabase.from).toHaveBeenCalledWith("users");
            expect(mockSupabase.from).toHaveBeenCalledWith("games");
            expect(result).toEqual({
                loggedInUserId: "123",
                allUsers: mockAllUsers,
                gamesData: mockGamesData,
                questions: mockQuestionsData,
            });
        });

        it("should throw an error if fetching authenticated user fails", async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: null,
                error: "Error",
            });

            await expect(fetchLayoutData()).rejects.toThrow(
                "Error fetching authenticated user"
            );
        });

        it("should throw an error if fetching users fails", async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUserRow },
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: null,
                error: "Error",
            });

            await expect(fetchLayoutData()).rejects.toThrow(
                "Error fetching users"
            );
        });

        it("should throw an error if fetching games fails", async () => {
            const mockAllUsers = [
                mockPublicUserRow,
                { ...mockPublicUserRow, user_id: "user2" },
            ];

            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUserRow },
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: mockAllUsers,
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: null,
                error: "Error",
            });

            await expect(fetchLayoutData()).rejects.toThrow(
                "Error fetching games"
            );
        });

        it("should throw an error if fetching questions fails", async () => {
            const mockAllUsers = [
                mockPublicUserRow,
                { ...mockPublicUserRow, user_id: "user2" },
            ];
            const mockGamesData = [
                mockPublicGameRow,
                { ...mockPublicGameRow, id: 222 },
            ];

            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUserRow },
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: mockAllUsers,
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: mockGamesData,
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: null,
                error: "Error",
            });

            await expect(fetchLayoutData()).rejects.toThrow(
                "Error fetching questions"
            );
        });
    });

    describe("mapAuthUserRowToPublicUserRow", () => {
        it("should throw an error if email is missing in authUserRow", () => {
            const userWithoutEmail = { ...mockAuthUserRow };
            delete userWithoutEmail.email;
            expect(() => {
                mapAuthUserRowToPublicUserRow(userWithoutEmail);
            }).toThrow("Email was not found in authUserRow");
        });
    });
});
