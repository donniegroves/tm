import { storeAvatar } from "../actions/storeAvatar";

const mockSupabase = {
    storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
    },
};

const mockFetch = jest.fn();

global.fetch = mockFetch;

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(() => mockSupabase),
}));

describe("storeAvatar", () => {
    const userId = "user123";
    const avatarUrl = "https://example.com/avatar.jpg";
    const contentType = "image/jpeg";
    const fileName = `${userId}.jpeg`;
    const publicUrl = "https://cdn.supabase.io/avatars/user123.jpeg";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns null if no avatarUrl is provided", async () => {
        const result = await storeAvatar(userId, null);
        expect(result).toBeNull();
    });

    it("uploads avatar and returns public URL", async () => {
        const arrayBuffer = new ArrayBuffer(8);
        mockFetch.mockResolvedValue({
            ok: true,
            headers: { get: () => contentType },
            arrayBuffer: () => Promise.resolve(arrayBuffer),
        });
        mockSupabase.storage.upload.mockResolvedValue({ error: null });
        mockSupabase.storage.getPublicUrl.mockReturnValue({
            data: { publicUrl },
        });

        const result = await storeAvatar(userId, avatarUrl);
        expect(mockFetch).toHaveBeenCalledWith(avatarUrl);
        expect(mockSupabase.storage.upload).toHaveBeenCalledWith(
            fileName,
            arrayBuffer,
            { contentType, upsert: true }
        );
        expect(result).toBe(publicUrl);
    });

    it("throws if fetch fails", async () => {
        mockFetch.mockResolvedValue({ ok: false });
        await expect(storeAvatar(userId, avatarUrl)).rejects.toThrow(
            "Error caching avatar"
        );
    });

    it("throws if content-type is missing", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            headers: { get: () => null },
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        });
        await expect(storeAvatar(userId, avatarUrl)).rejects.toThrow(
            "Error caching avatar"
        );
    });

    it("throws if upload fails", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            headers: { get: () => contentType },
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        });
        mockSupabase.storage.upload.mockResolvedValue({
            error: new Error("fail"),
        });
        await expect(storeAvatar(userId, avatarUrl)).rejects.toThrow(
            "Error caching avatar"
        );
    });
});
