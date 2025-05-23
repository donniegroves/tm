import { createClient } from "@/utils/supabase/server";
import { updatePublicUserRow } from "../actions/updatePublicUserRow";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

const mockUpdate = jest.fn();
const mockEq = jest.fn();

const mockSupabase = {
    from: jest.fn(() => ({
        update: mockUpdate,
        eq: mockEq,
    })),
};

beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    mockUpdate.mockReset();
    mockEq.mockReset();
    mockSupabase.from.mockClear();
});

describe("updatePublicUserRow", () => {
    it("calls supabase update with correct arguments", async () => {
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockEq.mockResolvedValue({ error: null, status: 204 });
        await expect(
            updatePublicUserRow("user1", { username: "foo", timezone: "bar" })
        ).resolves.toBeUndefined();
        expect(mockSupabase.from).toHaveBeenCalledWith("users");
        expect(mockUpdate).toHaveBeenCalledWith({
            username: "foo",
            timezone: "bar",
        });
        expect(mockEq).toHaveBeenCalledWith("user_id", "user1");
    });

    it("throws if error is returned", async () => {
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockEq.mockResolvedValue({ error: { message: "fail" }, status: 204 });
        await expect(
            updatePublicUserRow("user1", { username: "foo" })
        ).rejects.toThrow();
    });

    it("throws if status is not 204", async () => {
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockEq.mockResolvedValue({ error: null, status: 400 });
        await expect(
            updatePublicUserRow("user1", { username: "foo" })
        ).rejects.toThrow();
    });
});
