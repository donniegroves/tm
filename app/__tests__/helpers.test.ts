import { createClient } from "@/utils/supabase/server";
import { fetchLayoutData, getUserFromPublic } from "../helpers";

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
            const mockUserId = "123";
            const mockUserData = { id: mockUserId, name: "Test User" };

            mockSupabase.maybeSingle.mockResolvedValue({
                data: mockUserData,
                error: null,
            });

            const result = await getUserFromPublic(mockUserId);

            expect(mockSupabase.from).toHaveBeenCalledWith("users");
            expect(mockSupabase.select).toHaveBeenCalled();
            expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", mockUserId);
            expect(result).toEqual(mockUserData);
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
            const mockAuthUser = { id: "123", email: "test@example.com" };
            const mockAllUsers = [
                { user_id: "123", access_level: "admin" },
                { user_id: "456", access_level: "user" },
            ];
            const mockGamesData = [{ id: "game1" }, { id: "game2" }];

            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUser },
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

            const result = await fetchLayoutData();

            expect(mockSupabase.auth.getUser).toHaveBeenCalled();
            expect(mockSupabase.from).toHaveBeenCalledWith("users");
            expect(mockSupabase.from).toHaveBeenCalledWith("games");
            expect(result).toEqual({
                loggedInUser: {
                    ...mockAuthUser,
                    access_level: "admin",
                },
                otherUsers: [{ user_id: "456", access_level: "user" }],
                gamesData: mockGamesData,
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
            const mockAuthUser = { id: "123", email: "test@example.com" };

            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUser },
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
            const mockAuthUser = { id: "123", email: "test@example.com" };
            const mockAllUsers = [
                { user_id: "123", access_level: "admin" },
                { user_id: "456", access_level: "user" },
            ];

            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUser },
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

        it("should throw an error if access level is not found", async () => {
            const mockAuthUser = { id: "123", email: "test@example.com" };
            const mockAllUsers = [{ user_id: "456", access_level: "user" }];

            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: mockAuthUser },
                error: null,
            });
            mockSupabase.select.mockResolvedValueOnce({
                data: mockAllUsers,
                error: null,
            });

            await expect(fetchLayoutData()).rejects.toThrow(
                "Access level not found for authenticated user"
            );
        });
    });
});
