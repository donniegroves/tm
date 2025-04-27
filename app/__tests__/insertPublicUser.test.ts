import { createClient } from "@/utils/supabase/server";
import { insertPublicUser } from "../actions/insertPublicUser";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

const mockUserId = "test-user-id";

beforeEach(() => {
    jest.clearAllMocks();
});

const setupSupabaseMock = (error = false) => {
    const mockInsert = jest.fn().mockResolvedValue({
        error: error ? new Error("Insert failed") : null,
    });
    const mockFrom = jest.fn(() => ({ insert: mockInsert }));
    const mockSupabase = { from: mockFrom };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    return { mockInsert, mockFrom, createClient };
};

describe("insertPublicUser", () => {
    it("should insert a public user with the given userId", async () => {
        const { mockInsert, mockFrom, createClient } = setupSupabaseMock();

        await expect(insertPublicUser(mockUserId)).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockInsert).toHaveBeenCalledWith([
            {
                user_id: mockUserId,
                access_level: 0,
            },
        ]);
    });

    it("should throw an error if insertion fails", async () => {
        const { mockInsert, mockFrom, createClient } = setupSupabaseMock(true);

        await expect(insertPublicUser(mockUserId)).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockInsert).toHaveBeenCalledWith([
            {
                user_id: mockUserId,
                access_level: 0,
            },
        ]);
    });
});
