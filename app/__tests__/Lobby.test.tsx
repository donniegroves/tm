import { fireEvent, render, screen } from "@testing-library/react";
import Lobby from "../play/[share_code]/Lobby";
import { createWrapper } from "./helpers/createWrapper";
import { mockGamesData } from "./helpers/helpers";

jest.mock("../play/[share_code]/useLobbyHook");
jest.mock("../play/[share_code]/useStartGame");
jest.mock("../play/[share_code]/RealtimeContext");

jest.mock("../play/[share_code]/LobbyStatus", () => ({
    LobbyStatus: ({ allPlayersAreConnected, loggedInUserIsHost }: any) => (
        <div data-testid="lobby-status">
            {allPlayersAreConnected ? "All Connected" : "Waiting"}
            {loggedInUserIsHost ? " (Host)" : " (Player)"}
        </div>
    ),
}));

jest.mock("@heroui/button", () => ({
    Button: ({ children, onPress, isLoading, isDisabled, className }: any) => (
        <button
            onClick={onPress}
            disabled={isDisabled}
            className={className}
            data-testid="start-game-button"
            data-loading={isLoading}
        >
            {children}
        </button>
    ),
}));

const mockUseLobbyHook = require("../play/[share_code]/useLobbyHook")
    .useLobbyHook as jest.Mock;
const mockUseStartGame = require("../play/[share_code]/useStartGame")
    .useStartGame as jest.Mock;
const mockUseRealtimeContext = require("../play/[share_code]/RealtimeContext")
    .useRealtimeContext as jest.Mock;

describe("Lobby", () => {
    const mockStartGame = jest.fn();
    const mockChannel = {
        send: jest.fn(),
        id: "test-channel",
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseRealtimeContext.mockReturnValue({
            channel: mockChannel,
        });

        mockUseStartGame.mockReturnValue({
            startGame: mockStartGame,
            isStarting: false,
        });

        mockUseLobbyHook.mockReturnValue({
            loggedInUserIsHost: true,
            allPlayersAreConnected: true,
            isGameReady: true,
            gameData: mockGamesData[1],
        });
    });

    it("renders lobby for a valid game", () => {
        render(<Lobby />, { wrapper: createWrapper() });

        expect(screen.getByText("Lobby for: XYZXYZ")).toBeInTheDocument();
        expect(screen.getByTestId("lobby-status")).toBeInTheDocument();
        expect(screen.getByTestId("start-game-button")).toBeInTheDocument();
    });

    it("shows 'Game not found' when game is not ready", () => {
        mockUseLobbyHook.mockReturnValue({
            loggedInUserIsHost: false,
            allPlayersAreConnected: false,
            isGameReady: false,
            gameData: null,
        });

        render(<Lobby />, { wrapper: createWrapper() });

        expect(screen.getByText("Game not found.")).toBeInTheDocument();
        expect(
            screen.queryByTestId("start-game-button")
        ).not.toBeInTheDocument();
    });

    it("shows 'Game not found' when no game data", () => {
        mockUseLobbyHook.mockReturnValue({
            loggedInUserIsHost: true,
            allPlayersAreConnected: true,
            isGameReady: true,
            gameData: null,
        });

        render(<Lobby />, { wrapper: createWrapper() });

        expect(screen.getByText("Game not found.")).toBeInTheDocument();
        expect(
            screen.queryByTestId("start-game-button")
        ).not.toBeInTheDocument();
    });

    it("shows 'Game not found' when no channel", () => {
        mockUseRealtimeContext.mockReturnValue({
            channel: null,
        });

        render(<Lobby />, { wrapper: createWrapper() });

        expect(screen.getByText("Game not found.")).toBeInTheDocument();
        expect(
            screen.queryByTestId("start-game-button")
        ).not.toBeInTheDocument();
    });

    it("shows start game button when user is host and all players are connected", () => {
        render(<Lobby />, { wrapper: createWrapper() });

        const startButton = screen.getByTestId("start-game-button");
        expect(startButton).toBeInTheDocument();
        expect(startButton).not.toBeDisabled();
        expect(screen.getByText("Start Game")).toBeInTheDocument();
    });

    it("hides start game button when user is not host", () => {
        mockUseLobbyHook.mockReturnValue({
            loggedInUserIsHost: false,
            allPlayersAreConnected: true,
            isGameReady: true,
            gameData: mockGamesData[1],
        });

        render(<Lobby />, { wrapper: createWrapper() });

        expect(
            screen.queryByTestId("start-game-button")
        ).not.toBeInTheDocument();
    });

    it("hides start game button when not all players are connected", () => {
        mockUseLobbyHook.mockReturnValue({
            loggedInUserIsHost: true,
            allPlayersAreConnected: false,
            isGameReady: true,
            gameData: mockGamesData[1],
        });

        render(<Lobby />, { wrapper: createWrapper() });

        expect(
            screen.queryByTestId("start-game-button")
        ).not.toBeInTheDocument();
    });

    it("calls startGame when start button is clicked", () => {
        render(<Lobby />, { wrapper: createWrapper() });

        const startButton = screen.getByTestId("start-game-button");
        fireEvent.click(startButton);

        expect(mockStartGame).toHaveBeenCalledTimes(1);
        expect(mockStartGame).toHaveBeenCalledWith(mockGamesData[1]);
    });

    it("shows loading state when game is starting", () => {
        mockUseStartGame.mockReturnValue({
            startGame: mockStartGame,
            isStarting: true,
        });

        render(<Lobby />, { wrapper: createWrapper() });

        const startButton = screen.getByTestId("start-game-button");
        expect(startButton).toBeDisabled();
        expect(startButton.getAttribute("data-loading")).toBe("true");
    });

    it("disables button when game is starting", () => {
        mockUseStartGame.mockReturnValue({
            startGame: mockStartGame,
            isStarting: true,
        });

        render(<Lobby />, { wrapper: createWrapper() });

        const startButton = screen.getByTestId("start-game-button");
        expect(startButton).toBeDisabled();
    });

    it("passes correct props to LobbyStatus component", () => {
        mockUseLobbyHook.mockReturnValue({
            loggedInUserIsHost: false,
            allPlayersAreConnected: false,
            isGameReady: true,
            gameData: mockGamesData[1],
        });

        render(<Lobby />, { wrapper: createWrapper() });

        const lobbyStatus = screen.getByTestId("lobby-status");
        expect(lobbyStatus).toHaveTextContent("Waiting (Player)");
    });

    it("displays correct game share code in title", () => {
        mockUseLobbyHook.mockReturnValue({
            loggedInUserIsHost: true,
            allPlayersAreConnected: true,
            isGameReady: true,
            gameData: mockGamesData[0], // Game with share_code "XAMPLE"
        });

        render(<Lobby />, { wrapper: createWrapper() });

        expect(screen.getByText("Lobby for: XAMPLE")).toBeInTheDocument();
    });

    it("renders with correct CSS classes", () => {
        render(<Lobby />, { wrapper: createWrapper() });

        const mainContainer = screen
            .getByText("Lobby for: XYZXYZ")
            .closest("div");
        expect(mainContainer).toHaveClass(
            "flex-1",
            "flex",
            "flex-col",
            "items-center",
            "justify-center"
        );

        const title = screen.getByText("Lobby for: XYZXYZ");
        expect(title).toHaveClass("text-2xl", "font-bold", "mb-4");

        const startButton = screen.getByTestId("start-game-button");
        expect(startButton).toHaveClass("text-lg");
    });

    it("renders animated span inside start game button", () => {
        render(<Lobby />, { wrapper: createWrapper() });

        const animatedSpan = screen.getByText("Start Game");
        expect(animatedSpan.tagName.toLowerCase()).toBe("span");
        expect(animatedSpan).toHaveClass("animate-pulse");
    });
});
