import { createClient } from "@/utils/supabase/server";
import {
    getAvatarUrlFromUser,
    getFullNameStringFromUser,
    getUserFromAllUsers,
    mapAuthUserRowToPublicUserRow,
} from "../helpers";
import {
    mockAllUsers,
    mockAuthUserRow,
    mockPublicUserRow,
} from "./helpers/helpers";
import { getUserFromPublic } from "../server-helpers";

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
});
