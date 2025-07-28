import { renderHook, waitFor } from "@testing-library/react";
import { addAnswer, AddAnswerParams } from "../actions/addAnswer";
import { useAddAnswer } from "../hooks/useAddAnswer";
import { createWrapper } from "./helpers/createWrapper";
import {
    mockAllUsers,
    mockGamesData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../actions/addAnswer", () => ({
    addAnswer: jest.fn(),
}));

const mockAddAnswer = addAnswer as jest.Mock;

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries,
    }),
}));

describe("useAddAnswer", () => {
    const mockPreAnswer = {
        question_id: mockQuestionsData[0].id,
        game_id: mockGamesData[1].id,
        user_id: mockAllUsers[0].user_id,
        answer: "Test answer",
        created_at: "2024-06-01T12:00:00Z",
        updated_at: "2024-06-01T12:00:00Z",
    };

    const validParams: AddAnswerParams = {
        gameId: mockGamesData[1].id,
        questionId: mockQuestionsData[0].id,
        userId: mockAllUsers[0].user_id,
        answer: "Test answer",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockInvalidateQueries.mockClear();
    });

    it("returns a mutation object with correct properties", () => {
        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        expect(result.current).toHaveProperty("mutate");
        expect(result.current).toHaveProperty("mutateAsync");
        expect(result.current).toHaveProperty("isIdle");
        expect(result.current).toHaveProperty("isPending");
        expect(result.current).toHaveProperty("isError");
        expect(result.current).toHaveProperty("isSuccess");
        expect(result.current).toHaveProperty("data");
        expect(result.current).toHaveProperty("error");
    });

    it("successfully executes addAnswer mutation", async () => {
        mockAddAnswer.mockResolvedValue(mockPreAnswer);

        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(validParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockAddAnswer).toHaveBeenCalledWith(validParams);
        expect(result.current.data).toEqual(mockPreAnswer);
    });

    it("handles error when addAnswer fails", async () => {
        const mockError = new Error("Failed to add answer");
        mockAddAnswer.mockRejectedValue(mockError);

        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(validParams);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockAddAnswer).toHaveBeenCalledWith(validParams);
        expect(result.current.error).toEqual(mockError);
    });

    it("starts in idle state", () => {
        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isIdle).toBe(true);
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeNull();
    });

    it("transitions to pending state during mutation", async () => {
        let resolvePromise: (value: unknown) => void;
        const controlledPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockAddAnswer.mockReturnValue(controlledPromise);

        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(validParams);

        await waitFor(() => {
            expect(result.current.isPending).toBe(true);
        });

        expect(result.current.isIdle).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(false);

        resolvePromise!(mockPreAnswer);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });
    });

    it("works with different mock data", async () => {
        const alternativeParams: AddAnswerParams = {
            gameId: mockGamesData[0].id,
            questionId: mockQuestionsData[1].id,
            userId: mockAllUsers[2].user_id,
            answer: "Different answer",
        };

        const alternativeMockPreAnswer = {
            ...mockPreAnswer,
            question_id: alternativeParams.questionId,
            game_id: alternativeParams.gameId,
            user_id: alternativeParams.userId,
            answer: alternativeParams.answer,
        };

        mockAddAnswer.mockResolvedValue(alternativeMockPreAnswer);

        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(alternativeParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockAddAnswer).toHaveBeenCalledWith(alternativeParams);
        expect(result.current.data).toEqual(alternativeMockPreAnswer);
    });

    it("invalidates preAnswers query on settled", async () => {
        mockAddAnswer.mockResolvedValue(mockPreAnswer);

        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(validParams);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockInvalidateQueries).toHaveBeenCalledWith({
            queryKey: ["preAnswers"],
        });
    });

    it("invalidates preAnswers query even when mutation fails", async () => {
        const mockError = new Error("Mutation failed");
        mockAddAnswer.mockRejectedValue(mockError);

        const { result } = renderHook(() => useAddAnswer(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(validParams);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockInvalidateQueries).toHaveBeenCalledWith({
            queryKey: ["preAnswers"],
        });
    });
});
