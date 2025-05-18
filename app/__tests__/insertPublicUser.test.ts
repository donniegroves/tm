import { createClient } from "@/utils/supabase/server";
import { insertPublicUser } from "../actions/insertPublicUser";
import { mockPublicUserRow } from "../test-helpers";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

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

        await expect(
            insertPublicUser(mockPublicUserRow)
        ).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockInsert).toHaveBeenCalledWith([mockPublicUserRow]);
    });

    it("should throw an error if insertion fails", async () => {
        const { mockInsert, mockFrom, createClient } = setupSupabaseMock(true);

        await expect(insertPublicUser(mockPublicUserRow)).rejects.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("users");
        expect(mockInsert).toHaveBeenCalledWith([mockPublicUserRow]);
    });
});
