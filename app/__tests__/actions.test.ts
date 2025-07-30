import { createClient } from "@/utils/supabase/client";
import { fetchAllUsers } from "../actions/fetchAllUsers";
import { fetchGameQuestions } from "../actions/fetchGameQuestions";
import { fetchGames } from "../actions/fetchGames";
import { fetchGameUsers } from "../actions/fetchGameUsers";
import { fetchLoggedInUserId } from "../actions/fetchLoggedInUserId";
import { fetchPreAnswers } from "../actions/fetchPreAnswers";
import { fetchQuestions } from "../actions/fetchQuestions";
import {
    mockAllUsers,
    mockGameQuestionsData,
    mockGameUsersData,
    mockPreAnswersData,
} from "./helpers/helpers";

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
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({ data: mockAllUsers, error: null }),
            }),
        });
        const result = await fetchAllUsers();
        expect(result).toEqual(mockAllUsers);
    });
    it("throws on error or missing data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: "err" }),
            }),
        });
        await expect(fetchAllUsers()).rejects.toThrow("Error fetching users");
    });
    it("throws on bad data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({
                        data: [{ ...mockAllUsers[0], email: null }],
                        error: null,
                    }),
            }),
        });
        await expect(fetchAllUsers()).rejects.toThrow(
            "User data is incomplete"
        );
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
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({ data: mockGameUsersData, error: null }),
            }),
        });
        const result = await fetchGameUsers();
        expect(result).toEqual(mockGameUsersData);
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
    it("throws on bad data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({
                        data: [{ ...mockGameUsersData[0], is_host: null }],
                        error: null,
                    }),
            }),
        });
        await expect(fetchGameUsers()).rejects.toThrow(
            "Game user data is incomplete"
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

describe("fetchGameQuestions", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });
    it("returns game questions data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({
                        data: mockGameQuestionsData,
                        error: null,
                    }),
            }),
        });
        const result = await fetchGameQuestions();
        expect(result).toEqual(mockGameQuestionsData);
    });
    it("throws on error or missing data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: "err" }),
            }),
        });
        await expect(fetchGameQuestions()).rejects.toThrow(
            "Error fetching game questions"
        );
    });
    it("throws when error occurs but data is present", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({
                        data: mockGameQuestionsData,
                        error: "database error",
                    }),
            }),
        });
        await expect(fetchGameQuestions()).rejects.toThrow(
            "Error fetching game questions"
        );
    });
    it("throws when data is null but no error", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: null }),
            }),
        });
        await expect(fetchGameQuestions()).rejects.toThrow(
            "Error fetching game questions"
        );
    });
});

describe("fetchPreAnswers", () => {
    beforeEach(() => {
        createClientMock.mockReset();
    });
    it("returns pre answers data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({ data: mockPreAnswersData, error: null }),
            }),
        });
        const result = await fetchPreAnswers();
        expect(result).toEqual(mockPreAnswersData);
    });
    it("throws on error or missing data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () => Promise.resolve({ data: null, error: "err" }),
            }),
        });
        await expect(fetchPreAnswers()).rejects.toThrow(
            "Error fetching pre answers"
        );
    });
    it("throws on bad data", async () => {
        createClientMock.mockReturnValue({
            from: () => ({
                select: () =>
                    Promise.resolve({
                        data: [{ ...mockPreAnswersData[0], answer: null }],
                        error: null,
                    }),
            }),
        });
        await expect(fetchPreAnswers()).rejects.toThrow(
            "Pre answer data is incomplete"
        );
    });
});
