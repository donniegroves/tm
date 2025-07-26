import { createClient } from "@/utils/supabase/server";
import {
    getAvatarUrlFromUser,
    getFullNameStringFromUser,
    getStatusUsingShareCode,
    getUserFromAllUsers,
    mapAuthUserRowToPublicUserRow,
} from "../helpers";
import { getUserFromPublic } from "../server-helpers";
import {
    mockAllUsers,
    mockAuthUserRow,
    mockGamesData,
    mockPublicUserRow,
} from "./helpers/helpers";

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

    describe("mapAuthUserRowToPublicUserRow", () => {
        it("should throw an error if email is missing in authUserRow", () => {
            const userWithoutEmail = { ...mockAuthUserRow };
            delete userWithoutEmail.email;
            expect(() => {
                mapAuthUserRowToPublicUserRow(userWithoutEmail);
            }).toThrow("Email was not found in authUserRow");
        });
    });

    describe("getUserFromAllUsers", () => {
        it("finds by user_id", () => {
            const result = getUserFromAllUsers(
                { user_id: "user2" },
                mockAllUsers
            );
            expect(result).toEqual(mockAllUsers[1]);
        });

        it("finds by email", () => {
            const result = getUserFromAllUsers(
                { email: "testuser1@example.com" },
                mockAllUsers
            );
            expect(result).toEqual(mockAllUsers[0]);
        });

        it("finds by username", () => {
            const result = getUserFromAllUsers(
                { username: "testuser2" },
                mockAllUsers
            );
            expect(result).toEqual(mockAllUsers[1]);
        });

        it("returns undefined if not found", () => {
            const result = getUserFromAllUsers(
                { user_id: "notfound" },
                mockAllUsers
            );
            expect(result).toBeUndefined();
        });
    });

    describe("getFullNameStringFromUser", () => {
        it("returns the full_name if user is defined", () => {
            const user = { ...mockAllUsers[0], full_name: "Test User" };
            const result = getFullNameStringFromUser(user);
            expect(result).toBe("Test User");
        });
        it("returns undefined if user is undefined", () => {
            const result = getFullNameStringFromUser(undefined);
            expect(result).toBeUndefined();
        });
    });

    describe("getAvatarUrlFromUser", () => {
        it("returns the avatar_url if user is defined", () => {
            const user = { ...mockAllUsers[0], avatar_url: "avatar.png" };
            const result = getAvatarUrlFromUser(user);
            expect(result).toBe("avatar.png");
        });
        it("returns undefined if user is undefined", () => {
            const result = getAvatarUrlFromUser(undefined);
            expect(result).toBeUndefined();
        });
    });

    describe("getStatusUsingShareCode", () => {
        let originalLocation: Location;

        beforeEach(() => {
            originalLocation = window.location;
            delete (window as any).location;
        });

        afterEach(() => {
            (window as any).location = originalLocation;
        });

        it("returns 'not started' status when game status is 0", () => {
            window.location = { pathname: "/play/XAMPLE" } as any;

            const result = getStatusUsingShareCode(mockGamesData);

            expect(result).toEqual({
                round: null,
                status: "not started",
            });
        });

        it("returns 'ended' status when game status is -1", () => {
            const gamesWithEndedGame = [{ ...mockGamesData[0], status: -1 }];
            window.location = { pathname: "/play/XAMPLE" } as any;

            const result = getStatusUsingShareCode(gamesWithEndedGame);

            expect(result).toEqual({
                round: null,
                status: "ended",
            });
        });

        it("returns 'pre-question' status for odd positive status values", () => {
            const gamesWithOddStatus = [{ ...mockGamesData[0], status: 1 }];
            window.location = { pathname: "/play/XAMPLE" } as any;

            const result = getStatusUsingShareCode(gamesWithOddStatus);

            expect(result).toEqual({
                round: 1,
                status: "pre-question",
            });
        });

        it("returns 'pre-question' status for status 3", () => {
            const gamesWithStatus3 = [{ ...mockGamesData[0], status: 3 }];
            window.location = { pathname: "/play/XAMPLE" } as any;

            const result = getStatusUsingShareCode(gamesWithStatus3);

            expect(result).toEqual({
                round: 2,
                status: "pre-question",
            });
        });

        it("returns 'ranking' status for even positive status values", () => {
            const gamesWithEvenStatus = [{ ...mockGamesData[0], status: 2 }];
            window.location = { pathname: "/play/XAMPLE" } as any;

            const result = getStatusUsingShareCode(gamesWithEvenStatus);

            expect(result).toEqual({
                round: 1,
                status: "ranking",
            });
        });

        it("returns 'ranking' status for status 4", () => {
            const gamesWithStatus4 = [{ ...mockGamesData[0], status: 4 }];
            window.location = { pathname: "/play/XAMPLE" } as any;

            const result = getStatusUsingShareCode(gamesWithStatus4);

            expect(result).toEqual({
                round: 2,
                status: "ranking",
            });
        });

        it("throws error when game is not found", () => {
            window.location = { pathname: "/play/nonexistent/lobby" } as any;

            expect(() => {
                getStatusUsingShareCode(mockGamesData);
            }).toThrow("Game not found");
        });

        it("handles empty games array", () => {
            window.location = { pathname: "/play/XAMPLE" } as any;

            expect(() => {
                getStatusUsingShareCode([]);
            }).toThrow("Game not found");
        });

        it("throws error for invalid game status", () => {
            const gamesWithInvalidStatus = [
                { ...mockGamesData[0], status: -2 },
            ];
            window.location = { pathname: "/play/XAMPLE" } as any;

            expect(() => {
                getStatusUsingShareCode(gamesWithInvalidStatus);
            }).toThrow("Invalid game status");
        });
    });
});
