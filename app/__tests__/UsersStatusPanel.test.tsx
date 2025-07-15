import { RealtimeChannel } from "@supabase/supabase-js";
import {
    QueryClient,
    QueryClientProvider,
    UseMutationResult,
} from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Database } from "database.types";
import UsersStatusPanel from "../components/UsersStatusPanel";
import { useInsideContext } from "../inside/InsideContext";
import {
    mockAllUsers,
    mockGamesData,
    mockGameUsersData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../inside/InsideContext");
jest.mock("../hooks/useUpdateGameStatus");
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

const mockUseInsideContext = useInsideContext as jest.MockedFunction<
    typeof useInsideContext
>;

import { UpdateGameStatusReturn } from "../actions/updateGameStatus";
import { useUpdateGameStatus } from "../hooks/useUpdateGameStatus";
const mockUseUpdateGameStatus = useUpdateGameStatus as jest.MockedFunction<
    typeof useUpdateGameStatus
>;

const mockGameData: Database["public"]["Tables"]["games"]["Row"] =
    mockGamesData[1]; // Game with ID 222

const mockChannel = {
    send: jest.fn(),
} as unknown as RealtimeChannel;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    return Wrapper;
};

describe("UsersStatusPanel", () => {
    const mockMutateAsync = jest.fn();

    beforeEach(() => {
        mockUseInsideContext.mockReturnValue({
            gameUsers: mockGameUsersData,
            allUsers: mockAllUsers,
            games: mockGamesData,
            questions: mockQuestionsData,
            loggedInUserId: "user1", // user1 is the host in mockGameUsersData
        });

        mockUseUpdateGameStatus.mockReturnValue({
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
            UpdateGameStatusReturn,
            Error,
            Database["public"]["Tables"]["games"]["Row"]
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
        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={[]}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText("Contestants")).toBeInTheDocument();
    });

    it("renders users for the current game", () => {
        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={[]}
            />,
            { wrapper: createWrapper() }
        );

        // Based on mockGameUsersData, game 222 has user1 and user3
        expect(screen.getByTestId("avatar-user1")).toBeInTheDocument();
        expect(screen.getByTestId("avatar-user3")).toBeInTheDocument();
    });

    it("renders users with default color when not ready", () => {
        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={[]}
            />,
            { wrapper: createWrapper() }
        );

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
        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={readyUsers}
            />,
            { wrapper: createWrapper() }
        );

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
        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={[]}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText("Reset game")).toBeInTheDocument();
    });

    it("does not show reset button for non-host user", () => {
        mockUseInsideContext.mockReturnValue({
            gameUsers: mockGameUsersData,
            allUsers: mockAllUsers,
            games: mockGamesData,
            questions: mockQuestionsData,
            loggedInUserId: "user3", // user3 is not a host
        });

        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={[]}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.queryByText("Reset game")).not.toBeInTheDocument();
    });

    it("calls updateGameStatus and sends broadcast when reset is clicked", async () => {
        mockMutateAsync.mockResolvedValue({
            gameData: { ...mockGameData, status: 0 },
        });

        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={[]}
            />,
            { wrapper: createWrapper() }
        );

        const resetButton = screen.getByText("Reset game");
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                ...mockGameData,
                status: 0,
            });
        });

        await waitFor(() => {
            expect(mockChannel.send).toHaveBeenCalledWith({
                type: "broadcast",
                event: "game-status-changed",
            });
        });

        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    it("filters out users not in the current game", () => {
        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={[]}
            />,
            { wrapper: createWrapper() }
        );

        // Should show users in game 222 (user1 and user3)
        expect(screen.getByTestId("avatar-user1")).toBeInTheDocument();
        expect(screen.getByTestId("avatar-user3")).toBeInTheDocument();

        // Should not show user2 or user4 (not in game 222)
        expect(screen.queryByTestId("avatar-user2")).not.toBeInTheDocument();
        expect(screen.queryByTestId("avatar-user4")).not.toBeInTheDocument();
    });

    it("passes correct props to AvatarWithName", () => {
        render(
            <UsersStatusPanel
                channel={mockChannel}
                gameData={mockGameData}
                readyUsers={["user1"]}
            />,
            { wrapper: createWrapper() }
        );

        const avatar = screen.getByTestId("avatar-user1");
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute("data-color", "primary");
    });
});
