import { act, renderHook } from "@testing-library/react";
import { useInsertGameQuestion } from "../hooks/useInsertGameQuestion";
import { useUpdateGameStatus } from "../hooks/useUpdateGameStatus";
import { useStartGame } from "../play/[share_code]/useStartGame";
import { createWrapper } from "./helpers/createWrapper";
import {
    defaultInsideContextValues,
    defaultRealtimeContextValues,
    mockGamesData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../hooks/useInsertGameQuestion");
jest.mock("../hooks/useUpdateGameStatus");

const mockUseInsertGameQuestion = useInsertGameQuestion as jest.MockedFunction<
    typeof useInsertGameQuestion
>;
const mockUseUpdateGameStatus = useUpdateGameStatus as jest.MockedFunction<
    typeof useUpdateGameStatus
>;

describe("useStartGame", () => {
    let mockInsertGameQuestionMutation: {
        mutateAsync: jest.Mock;
        isPending: boolean;
    };
    let mockUpdateGameStatusMutation: {
        mutateAsync: jest.Mock;
        isPending: boolean;
    };
    let mockChannelSend: jest.Mock;

    beforeEach(() => {
        mockInsertGameQuestionMutation = {
            mutateAsync: jest.fn(),
            isPending: false,
        };
        mockUpdateGameStatusMutation = {
            mutateAsync: jest.fn(),
            isPending: false,
        };
        mockChannelSend = jest.fn();

        mockUseInsertGameQuestion.mockReturnValue(
            mockInsertGameQuestionMutation as unknown as ReturnType<
                typeof useInsertGameQuestion
            >
        );
        mockUseUpdateGameStatus.mockReturnValue(
            mockUpdateGameStatusMutation as unknown as ReturnType<
                typeof useUpdateGameStatus
            >
        );

        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it("successfully starts a game", async () => {
        const mockGameQuestion = {
            game_id: mockGamesData[0].id,
            round: 1,
            question_id: mockQuestionsData[0].id,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        };
        const mockUpdatedGame = {
            ...mockGamesData[0],
            status: 1,
        };

        mockInsertGameQuestionMutation.mutateAsync.mockResolvedValue(
            mockGameQuestion
        );
        mockUpdateGameStatusMutation.mutateAsync.mockResolvedValue(
            mockUpdatedGame
        );

        const realtimeContextValues = {
            ...defaultRealtimeContextValues,
            channel: {
                ...defaultRealtimeContextValues.channel,
                send: mockChannelSend,
            } as unknown as typeof defaultRealtimeContextValues.channel,
        };

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(
                defaultInsideContextValues,
                realtimeContextValues
            ),
        });

        await act(async () => {
            await result.current.startGame(mockGamesData[0]);
        });

        expect(mockInsertGameQuestionMutation.mutateAsync).toHaveBeenCalledWith(
            {
                gameId: mockGamesData[0].id,
                round: 1,
                questionId: expect.any(Number),
            }
        );

        const callArgs =
            mockInsertGameQuestionMutation.mutateAsync.mock.calls[0][0];
        expect(mockQuestionsData.map((q) => q.id)).toContain(
            callArgs.questionId
        );

        expect(mockUpdateGameStatusMutation.mutateAsync).toHaveBeenCalledWith({
            ...mockGamesData[0],
            status: mockGamesData[0].status + 1,
        });

        expect(mockChannelSend).toHaveBeenCalledWith({
            type: "broadcast",
            event: "game-status-changed",
        });
    });

    it("throws error when insertGameQuestion fails", async () => {
        const insertError = new Error("Insert failed");
        mockInsertGameQuestionMutation.mutateAsync.mockRejectedValue(
            insertError
        );

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await expect(
                result.current.startGame(mockGamesData[0])
            ).rejects.toThrow("Insert failed");
        });

        expect(console.error).toHaveBeenCalledWith(
            "Failed to start game:",
            insertError
        );
        expect(mockUpdateGameStatusMutation.mutateAsync).not.toHaveBeenCalled();
    });

    it("throws error when updateGameStatus fails", async () => {
        const mockGameQuestion = {
            game_id: mockGamesData[0].id,
            round: 1,
            question_id: mockQuestionsData[0].id,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        };
        const updateError = new Error("Update failed");

        mockInsertGameQuestionMutation.mutateAsync.mockResolvedValue(
            mockGameQuestion
        );
        mockUpdateGameStatusMutation.mutateAsync.mockRejectedValue(updateError);

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await expect(
                result.current.startGame(mockGamesData[0])
            ).rejects.toThrow("Update failed");
        });

        expect(console.error).toHaveBeenCalledWith(
            "Failed to start game:",
            updateError
        );
    });

    it("throws error when insertResult is null", async () => {
        mockInsertGameQuestionMutation.mutateAsync.mockResolvedValue(null);
        mockUpdateGameStatusMutation.mutateAsync.mockResolvedValue(
            mockGamesData[0]
        );

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await expect(
                result.current.startGame(mockGamesData[0])
            ).rejects.toThrow(
                `Failed to edit game with id ${mockGamesData[0].id}`
            );
        });
    });

    it("throws error when updateResult is null", async () => {
        const mockGameQuestion = {
            game_id: mockGamesData[0].id,
            round: 1,
            question_id: mockQuestionsData[0].id,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        };

        mockInsertGameQuestionMutation.mutateAsync.mockResolvedValue(
            mockGameQuestion
        );
        mockUpdateGameStatusMutation.mutateAsync.mockResolvedValue(null);

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await expect(
                result.current.startGame(mockGamesData[0])
            ).rejects.toThrow(
                `Failed to edit game with id ${mockGamesData[0].id}`
            );
        });
    });

    it("handles case when channel is null", async () => {
        const mockGameQuestion = {
            game_id: mockGamesData[0].id,
            round: 1,
            question_id: mockQuestionsData[0].id,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        };
        const mockUpdatedGame = {
            ...mockGamesData[0],
            status: 1,
        };

        mockInsertGameQuestionMutation.mutateAsync.mockResolvedValue(
            mockGameQuestion
        );
        mockUpdateGameStatusMutation.mutateAsync.mockResolvedValue(
            mockUpdatedGame
        );

        const realtimeContextValues = {
            ...defaultRealtimeContextValues,
            channel:
                null as unknown as typeof defaultRealtimeContextValues.channel,
        };

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(
                defaultInsideContextValues,
                realtimeContextValues
            ),
        });

        await act(async () => {
            await result.current.startGame(mockGamesData[0]);
        });

        expect(mockChannelSend).not.toHaveBeenCalled();
    });

    it("returns correct isStarting state when insertGameQuestion is pending", () => {
        mockInsertGameQuestionMutation.isPending = true;
        mockUpdateGameStatusMutation.isPending = false;

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isStarting).toBe(true);
    });

    it("returns correct isStarting state when updateGameStatus is pending", () => {
        mockInsertGameQuestionMutation.isPending = false;
        mockUpdateGameStatusMutation.isPending = true;

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isStarting).toBe(true);
    });

    it("returns correct isStarting state when both mutations are pending", () => {
        mockInsertGameQuestionMutation.isPending = true;
        mockUpdateGameStatusMutation.isPending = true;

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isStarting).toBe(true);
    });

    it("returns correct isStarting state when no mutations are pending", () => {
        mockInsertGameQuestionMutation.isPending = false;
        mockUpdateGameStatusMutation.isPending = false;

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isStarting).toBe(false);
    });

    it("selects random question from available questions", async () => {
        const mockGameQuestion = {
            game_id: mockGamesData[0].id,
            round: 1,
            question_id: mockQuestionsData[0].id,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        };
        const mockUpdatedGame = {
            ...mockGamesData[0],
            status: 1,
        };

        mockInsertGameQuestionMutation.mutateAsync.mockResolvedValue(
            mockGameQuestion
        );
        mockUpdateGameStatusMutation.mutateAsync.mockResolvedValue(
            mockUpdatedGame
        );

        const mockMath = Object.create(global.Math);
        mockMath.random = () => 0;
        global.Math = mockMath;

        const { result } = renderHook(() => useStartGame(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.startGame(mockGamesData[0]);
        });

        const callArgs =
            mockInsertGameQuestionMutation.mutateAsync.mock.calls[0][0];
        expect(callArgs.questionId).toBe(mockQuestionsData[0].id);

        global.Math = Math;
    });
});
