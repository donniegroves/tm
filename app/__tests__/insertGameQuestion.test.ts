import { createClient } from "@/utils/supabase/client";
import { insertGameQuestion } from "../actions/insertGameQuestion";

jest.mock("@/utils/supabase/client");

const createClientMock = createClient as jest.Mock;

describe("insertGameQuestion", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("successfully inserts a game question", async () => {
        const mockGameQuestion = {
            id: 1,
            game_id: 123,
            round: 2,
            question_id: 456,
            created_at: "2023-01-01T00:00:00Z",
        };

        const mockSingle = jest.fn().mockResolvedValue({
            data: mockGameQuestion,
            error: null,
            status: 201,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await insertGameQuestion({
            gameId: 123,
            round: 2,
            questionId: 456,
        });

        expect(createClient).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalledWith("game_questions");
        expect(mockInsert).toHaveBeenCalledWith({
            game_id: 123,
            round: 2,
            question_id: 456,
        });
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(result).toEqual(mockGameQuestion);
    });

    it("throws error when database insertion fails with error message", async () => {
        const mockError = { message: "Database constraint violation" };

        const mockSingle = jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
            status: 400,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(
            insertGameQuestion({
                gameId: 123,
                round: 2,
                questionId: 456,
            })
        ).rejects.toThrow("Database constraint violation");

        expect(mockFrom).toHaveBeenCalledWith("game_questions");
        expect(mockInsert).toHaveBeenCalledWith({
            game_id: 123,
            round: 2,
            question_id: 456,
        });
    });

    it("throws generic error when database insertion fails without error message", async () => {
        const mockSingle = jest.fn().mockResolvedValue({
            data: null,
            error: null,
            status: 400,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(
            insertGameQuestion({
                gameId: 123,
                round: 2,
                questionId: 456,
            })
        ).rejects.toThrow("Failed to insert game question");

        expect(mockFrom).toHaveBeenCalledWith("game_questions");
    });

    it("throws error when status is not 201", async () => {
        const mockGameQuestion = {
            id: 1,
            game_id: 123,
            round: 2,
            question_id: 456,
            created_at: "2023-01-01T00:00:00Z",
        };

        const mockSingle = jest.fn().mockResolvedValue({
            data: mockGameQuestion,
            error: null,
            status: 200, // Wrong status
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(
            insertGameQuestion({
                gameId: 123,
                round: 2,
                questionId: 456,
            })
        ).rejects.toThrow("Failed to insert game question");
    });

    it("throws error when data is null", async () => {
        const mockSingle = jest.fn().mockResolvedValue({
            data: null,
            error: null,
            status: 201,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        createClientMock.mockReturnValue({ from: mockFrom });

        await expect(
            insertGameQuestion({
                gameId: 123,
                round: 2,
                questionId: 456,
            })
        ).rejects.toThrow("Failed to insert game question");
    });

    it("handles different parameter values correctly", async () => {
        const mockGameQuestion = {
            id: 2,
            game_id: 999,
            round: 1,
            question_id: 777,
            created_at: "2023-01-01T00:00:00Z",
        };

        const mockSingle = jest.fn().mockResolvedValue({
            data: mockGameQuestion,
            error: null,
            status: 201,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await insertGameQuestion({
            gameId: 999,
            round: 1,
            questionId: 777,
        });

        expect(mockInsert).toHaveBeenCalledWith({
            game_id: 999,
            round: 1,
            question_id: 777,
        });
        expect(result).toEqual(mockGameQuestion);
    });

    it("handles zero values correctly", async () => {
        const mockGameQuestion = {
            id: 3,
            game_id: 0,
            round: 0,
            question_id: 0,
            created_at: "2023-01-01T00:00:00Z",
        };

        const mockSingle = jest.fn().mockResolvedValue({
            data: mockGameQuestion,
            error: null,
            status: 201,
        });
        const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        createClientMock.mockReturnValue({ from: mockFrom });

        const result = await insertGameQuestion({
            gameId: 0,
            round: 0,
            questionId: 0,
        });

        expect(mockInsert).toHaveBeenCalledWith({
            game_id: 0,
            round: 0,
            question_id: 0,
        });
        expect(result).toEqual(mockGameQuestion);
    });
});
