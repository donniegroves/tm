import { createClient } from "@/utils/supabase/client";
import { fetchAllUsers } from "../actions/fetchAllUsers";
import { fetchGames } from "../actions/fetchGames";
import { fetchLoggedInUserId } from "../actions/fetchLoggedInUserId";
import { fetchQuestions } from "../actions/fetchQuestions";
import { fetchGameUsers } from "../actions/fetchGameUsers";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const createClientMock = createClient as jest.Mock;

describe("fetchQuestions", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });
    it("returns questions data", async () => {
        const mockQuestions = [{ id: 1, pre_question: "What is your name?" }];
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({ data: mockQuestions, error: null }),
            }),
        });
        const result = await fetchQuestions();
        expect(result).toEqual(mockQuestions);
    });
    it("throws on error or missing data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: "err" }),
            }),
        });
        await expect(fetchQuestions()).rejects.toThrow(
            "Error fetching questions"
        );
    });
});

describe("fetchAllUsers", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });
    it("returns users data", async () => {
        const mockUsers = [{ user_id: "1", full_name: "Test User" }];
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: mockUsers, error: null }),
            }),
        });
        const result = await fetchAllUsers();
        expect(result).toEqual(mockUsers);
    });
    it("throws on error or missing data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: "err" }),
            }),
        });
        await expect(fetchAllUsers()).rejects.toThrow("Error fetching users");
    });
});

describe("fetchGames", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });
    it("returns games data", async () => {
        const mockGames = [{ id: 1, share_code: "abc" }];
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: mockGames, error: null }),
            }),
        });
        const result = await fetchGames();
        expect(result).toEqual(mockGames);
    });
    it("throws on error or missing data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: "err" }),
            }),
        });
        await expect(fetchGames()).rejects.toThrow("Error fetching games");
    });
});

describe("fetchGameUsers", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });
    it("returns game users data", async () => {
        const mockGameUsers = [{ user_id: "user1", game_id: 1 }];
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({ data: mockGameUsers, error: null }),
            }),
        });
        const result = await fetchGameUsers();
        expect(result).toEqual(mockGameUsers);
    });
    it("throws on error or missing data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: "err" }),
            }),
        });
        await expect(fetchGameUsers()).rejects.toThrow(
            "Error fetching game users"
        );
    });
});

describe("fetchLoggedInUserId", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });
    it("returns user id", async () => {
        createClientMock.mockReturnValue({
            auth: {
                getUser: () =>
                    Promise.resolve({
                        data: { user: { id: "user-123" } },
                        error: null,
                    }),
            },
        });
        const result = await fetchLoggedInUserId();
        expect(result).toBe("user-123");
    });
    it("throws on error or missing user", async () => {
        createClientMock.mockReturnValue({
            auth: {
                getUser: () =>
                    Promise.resolve({ data: { user: null }, error: "err" }),
            },
        });
        await expect(fetchLoggedInUserId()).rejects.toThrow(
            "Error fetching authenticated user"
        );
    });
});
