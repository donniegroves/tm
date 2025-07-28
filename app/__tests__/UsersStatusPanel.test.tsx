import { UseMutationResult } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Database } from "database.types";
import UsersStatusPanel from "../components/UsersStatusPanel";
import {
    defaultRealtimeContextValues,
    mockAllUsers,
    mockGamesData,
    mockGameUsersData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../hooks/useResetGame");
jest.mock("../components/AvatarWithName", () => {
    return function MockAvatarWithName({
        userId,
        color,
    }: {
        userId: string;
        color: string;
    }) {
        return (
            <div data-testid={`avatar-${userId}`} data-color={color}>
                Mock Avatar for {userId}
            </div>
        );
    };
});

import { useResetGame } from "../hooks/useResetGame";
import { createWrapper } from "./helpers/createWrapper";
const mockUseResetGame = useResetGame as jest.MockedFunction<
    typeof useResetGame
>;

describe("UsersStatusPanel", () => {
    const mockMutateAsync = jest.fn();

    beforeEach(() => {
        mockUseResetGame.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            isIdle: true,
            isError: false,
            isSuccess: false,
            data: undefined,
            error: null,
            variables: undefined,
            context: undefined,
            isLoading: false,
            mutate: jest.fn(),
            reset: jest.fn(),
            status: "idle",
            failureCount: 0,
            failureReason: null,
            pauseVariable: undefined,
            submittedAt: 0,
        } as unknown as UseMutationResult<
            boolean,
            Error,
            { gameId: Database["public"]["Tables"]["games"]["Row"]["id"] }
        >);

        Object.defineProperty(window, "location", {
            value: {
                reload: jest.fn(),
            },
            writable: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the Contestants heading", () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        expect(screen.getByText("Contestants")).toBeInTheDocument();
    });

    it("renders users for the current game", () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        // Based on mockGameUsersData, game 222 has user1 and user3
        expect(screen.getByTestId("avatar-user1")).toBeInTheDocument();
        expect(screen.getByTestId("avatar-user3")).toBeInTheDocument();
    });

    it("renders users with default color when not ready", () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        expect(screen.getByTestId("avatar-user1")).toHaveAttribute(
            "data-color",
            "default"
        );
        expect(screen.getByTestId("avatar-user3")).toHaveAttribute(
            "data-color",
            "default"
        );
    });

    it("renders ready users with primary color", () => {
        const readyUsers = ["user1"];
        render(<UsersStatusPanel />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                readyUsers,
            }),
        });

        expect(screen.getByTestId("avatar-user1")).toHaveAttribute(
            "data-color",
            "primary"
        );
        expect(screen.getByTestId("avatar-user3")).toHaveAttribute(
            "data-color",
            "default"
        );
    });

    it("shows reset button for host user", () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        expect(screen.getByText("Reset game")).toBeInTheDocument();
    });

    it("does not show reset button for non-host user", () => {
        render(<UsersStatusPanel />, {
            wrapper: createWrapper({
                gameUsers: mockGameUsersData,
                allUsers: mockAllUsers,
                games: mockGamesData,
                questions: mockQuestionsData,
                loggedInUserId: "user3", // user3 is not a host
                gameQuestions: [],
            }),
        });

        expect(screen.queryByText("Reset game")).not.toBeInTheDocument();
    });

    it("calls resetGame and sends broadcast when reset is clicked", async () => {
        mockMutateAsync.mockResolvedValue({
            gameData: { ...mockGamesData[1], status: 0 },
        });

        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        const resetButton = screen.getByText("Reset game");
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                gameId: mockGamesData[1].id,
            });
        });

        await waitFor(() => {
            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledWith({
                type: "broadcast",
                event: "game-status-changed",
            });
        });
    });

    it("filters out users not in the current game", () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        // Should show users in game 222 (user1 and user3)
        expect(screen.getByTestId("avatar-user1")).toBeInTheDocument();
        expect(screen.getByTestId("avatar-user3")).toBeInTheDocument();

        // Should not show user2 or user4 (not in game 222)
        expect(screen.queryByTestId("avatar-user2")).not.toBeInTheDocument();
        expect(screen.queryByTestId("avatar-user4")).not.toBeInTheDocument();
    });

    it("shows game not found when no gameData or channel", () => {
        render(<UsersStatusPanel />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                channel: null,
            }),
        });

        expect(screen.getByText("Game not found.")).toBeInTheDocument();
    });

    it("passes correct props to AvatarWithName", () => {
        render(<UsersStatusPanel />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                readyUsers: ["user1"],
            }),
        });

        const avatar = screen.getByTestId("avatar-user1");
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute("data-color", "primary");
    });
});
