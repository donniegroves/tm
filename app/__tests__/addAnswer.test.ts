import { createClient } from "@/utils/supabase/client";
import { addAnswer, AddAnswerParams } from "../actions/addAnswer";
import {
    mockAllUsers,
    mockGamesData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("@/utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.Mock;

describe("addAnswer", () => {
    const mockSupabase = {
        from: jest.fn(),
    };

    const mockUpsert = jest.fn();
    const mockSelect = jest.fn();
    const mockSingle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockSupabase.from.mockReturnValue({
            upsert: mockUpsert,
        });
        mockUpsert.mockReturnValue({
            select: mockSelect,
        });
        mockSelect.mockReturnValue({
            single: mockSingle,
        });

        mockCreateClient.mockReturnValue(mockSupabase);
    });

    const validParams: AddAnswerParams = {
        gameId: mockGamesData[1].id,
        questionId: mockQuestionsData[0].id,
        userId: mockAllUsers[0].user_id,
        answer: "My test answer",
    };

    const mockPreAnswer = {
        question_id: validParams.questionId,
        game_id: validParams.gameId,
        user_id: validParams.userId,
        answer: validParams.answer,
        created_at: "2024-06-01T12:00:00Z",
        updated_at: "2024-06-01T12:00:00Z",
    };

    it("successfully adds an answer", async () => {
        mockSingle.mockResolvedValue({
            data: mockPreAnswer,
            error: null,
        });

        const result = await addAnswer(validParams);

        expect(mockSupabase.from).toHaveBeenCalledWith("pre_answers");
        expect(mockUpsert).toHaveBeenCalledWith({
            question_id: validParams.questionId,
            game_id: validParams.gameId,
            user_id: validParams.userId,
            answer: validParams.answer,
        });
        expect(mockSelect).toHaveBeenCalled();
        expect(mockSingle).toHaveBeenCalled();
        expect(result).toEqual(mockPreAnswer);
    });

    it("throws error when Supabase returns an error", async () => {
        const mockError = new Error("Database error");
        mockSingle.mockResolvedValue({
            data: null,
            error: mockError,
        });

        await expect(addAnswer(validParams)).rejects.toThrow(
            "Failed to add answer"
        );

        expect(mockSupabase.from).toHaveBeenCalledWith("pre_answers");
        expect(mockUpsert).toHaveBeenCalledWith({
            question_id: validParams.questionId,
            game_id: validParams.gameId,
            user_id: validParams.userId,
            answer: validParams.answer,
        });
    });

    it("throws error when no data is returned", async () => {
        mockSingle.mockResolvedValue({
            data: null,
            error: null,
        });

        await expect(addAnswer(validParams)).rejects.toThrow(
            "Failed to add answer"
        );
    });

    it("handles upsert operation correctly", async () => {
        mockSingle.mockResolvedValue({
            data: mockPreAnswer,
            error: null,
        });

        await addAnswer(validParams);

        expect(mockUpsert).toHaveBeenCalledWith({
            question_id: mockQuestionsData[0].id,
            game_id: mockGamesData[1].id,
            user_id: mockAllUsers[0].user_id,
            answer: "My test answer",
        });
    });

    it("works with different mock data", async () => {
        const alternativeParams: AddAnswerParams = {
            gameId: mockGamesData[0].id,
            questionId: mockQuestionsData[1].id,
            userId: mockAllUsers[2].user_id,
            answer: "Another test answer",
        };

        const alternativeMockPreAnswer = {
            ...mockPreAnswer,
            question_id: alternativeParams.questionId,
            game_id: alternativeParams.gameId,
            user_id: alternativeParams.userId,
            answer: alternativeParams.answer,
        };

        mockSingle.mockResolvedValue({
            data: alternativeMockPreAnswer,
            error: null,
        });

        const result = await addAnswer(alternativeParams);

        expect(mockUpsert).toHaveBeenCalledWith({
            question_id: alternativeParams.questionId,
            game_id: alternativeParams.gameId,
            user_id: alternativeParams.userId,
            answer: alternativeParams.answer,
        });
        expect(result).toEqual(alternativeMockPreAnswer);
    });

    it("creates client once per call", async () => {
        mockSingle.mockResolvedValue({
            data: mockPreAnswer,
            error: null,
        });

        await addAnswer(validParams);

        expect(mockCreateClient).toHaveBeenCalledTimes(1);
    });
});
