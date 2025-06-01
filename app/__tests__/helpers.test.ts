import { createClient } from "@/utils/supabase/server";
import { getUserFromPublic, mapAuthUserRowToPublicUserRow } from "../helpers";
import { mockAuthUserRow, mockPublicUserRow } from "../test-helpers";

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
});
