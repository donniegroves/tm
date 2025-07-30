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
jest.mock("../hooks/useIsMaster");
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
jest.mock("../components/IconSvg", () => ({
    CheckmarkSvg: function MockCheckmarkSvg({
        size,
        className,
    }: {
        size: number;
        className: string;
    }) {
        return (
            <div
                data-testid="checkmark-svg"
                data-size={size}
                className={className}
            >
                ✓
            </div>
        );
    },
}));

import { useIsMaster } from "../hooks/useIsMaster";
import { useResetGame } from "../hooks/useResetGame";
import { createWrapper } from "./helpers/createWrapper";
const mockUseResetGame = useResetGame as jest.MockedFunction<
    typeof useResetGame
>;
const mockUseIsMaster = useIsMaster as jest.MockedFunction<typeof useIsMaster>;

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

        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: false,
            currentMasterUserId: "user2",
        });

        Object.defineProperty(window, "location", {
            value: {
                reload: jest.fn(),
                pathname: "/play/XYZXYZ",
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
                loggedInUserId: "user3",
                gameQuestions: [],
                preAnswers: [],
            }),
        });

        expect(screen.queryByText("Reset game")).not.toBeInTheDocument();
    });

    it("calls resetGame and sends broadcast when reset is clicked", async () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        const resetButton = screen.getByText("Reset game");
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                {
                    gameId: mockGamesData[1].id,
                },
                {
                    onSuccess: expect.any(Function),
                }
            );
        });
    });

    it("sends game-reset broadcast on successful reset", async () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        const resetButton = screen.getByText("Reset game");
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
        });

        const mutateCall = mockMutateAsync.mock.calls[0];
        const mutateOptions = mutateCall[1];
        const onSuccessCallback = mutateOptions.onSuccess;

        onSuccessCallback();

        expect(defaultRealtimeContextValues.channel?.send).toHaveBeenCalledWith(
            {
                type: "broadcast",
                event: "game-reset",
            }
        );
    });

    it("filters out users not in the current game", () => {
        render(<UsersStatusPanel />, { wrapper: createWrapper() });

        expect(screen.getByTestId("avatar-user1")).toBeInTheDocument();
        expect(screen.getByTestId("avatar-user3")).toBeInTheDocument();

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

    describe("Pre-question status functionality", () => {
        it("shows checkmarks during pre-question status", () => {
            render(<UsersStatusPanel />, { wrapper: createWrapper() });

            const checkmarks = screen.getAllByTestId("checkmark-svg");
            expect(checkmarks).toHaveLength(2);
        });

        it("does not show checkmarks during non-pre-question status", () => {
            render(<UsersStatusPanel />, {
                wrapper: createWrapper({
                    gameUsers: mockGameUsersData,
                    allUsers: mockAllUsers,
                    games: [
                        ...mockGamesData.slice(0, 1),
                        { ...mockGamesData[1], status: 2 },
                        ...mockGamesData.slice(2),
                    ],
                    questions: mockQuestionsData,
                    loggedInUserId: "user1",
                    gameQuestions: [],
                    preAnswers: [],
                }),
            });

            expect(
                screen.queryByTestId("checkmark-svg")
            ).not.toBeInTheDocument();
        });

        it("applies correct styling to checkmark for users who have answered", () => {
            render(<UsersStatusPanel />, { wrapper: createWrapper() });

            const checkmarks = screen.getAllByTestId("checkmark-svg");

            const user1Checkmark = checkmarks.find((checkmark) =>
                checkmark.className.includes("text-customlight/100")
            );
            expect(user1Checkmark).toBeInTheDocument();
        });

        it("applies correct styling to checkmark for master user", () => {
            mockUseIsMaster.mockReturnValue({
                loggedInUserIsMaster: false,
                currentMasterUserId: "user3",
            });

            render(<UsersStatusPanel />, { wrapper: createWrapper() });

            const checkmarks = screen.getAllByTestId("checkmark-svg");

            const masterCheckmark = checkmarks.find((checkmark) =>
                checkmark.className.includes("text-customlight/100")
            );
            expect(masterCheckmark).toBeInTheDocument();
        });

        it("applies faded styling to checkmark for users who haven't answered and aren't master", () => {
            render(<UsersStatusPanel />, {
                wrapper: createWrapper({
                    gameUsers: mockGameUsersData,
                    allUsers: mockAllUsers,
                    games: mockGamesData,
                    questions: mockQuestionsData,
                    loggedInUserId: "user1",
                    gameQuestions: [],
                    preAnswers: [],
                }),
            });

            const checkmarks = screen.getAllByTestId("checkmark-svg");

            checkmarks.forEach((checkmark) => {
                expect(checkmark.className).toContain("text-customlight/15");
            });
        });

        it("applies w-40 width class during pre-question status", () => {
            const { container } = render(<UsersStatusPanel />, {
                wrapper: createWrapper(),
            });

            const mainDiv = container.firstChild as HTMLElement;
            expect(mainDiv).toHaveClass("w-40");
        });

        it("applies w-32 width class during non-pre-question status", () => {
            const { container } = render(<UsersStatusPanel />, {
                wrapper: createWrapper({
                    gameUsers: mockGameUsersData,
                    allUsers: mockAllUsers,
                    games: [
                        ...mockGamesData.slice(0, 1),
                        { ...mockGamesData[1], status: 2 },
                        ...mockGamesData.slice(2),
                    ],
                    questions: mockQuestionsData,
                    loggedInUserId: "user1",
                    gameQuestions: [],
                    preAnswers: [],
                }),
            });

            const mainDiv = container.firstChild as HTMLElement;
            expect(mainDiv).toHaveClass("w-32");
        });
    });

    describe("Master user integration", () => {
        it("uses currentMasterUserId from useIsMaster hook", () => {
            mockUseIsMaster.mockReturnValue({
                loggedInUserIsMaster: false,
                currentMasterUserId: "user1",
            });

            render(<UsersStatusPanel />, { wrapper: createWrapper() });

            expect(mockUseIsMaster).toHaveBeenCalled();
        });

        it("handles when logged in user is the master", () => {
            mockUseIsMaster.mockReturnValue({
                loggedInUserIsMaster: true,
                currentMasterUserId: "user1",
            });

            render(<UsersStatusPanel />, { wrapper: createWrapper() });

            expect(screen.getByText("Contestants")).toBeInTheDocument();
            expect(screen.getByTestId("avatar-user1")).toBeInTheDocument();
        });
    });
});
