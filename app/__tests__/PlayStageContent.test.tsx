import { render, screen } from "@testing-library/react";
import PlayStageContent from "../play/[share_code]/PlayStageContent";
import { createWrapper } from "./helpers/createWrapper";
import { mockGamesData } from "./helpers/helpers";

jest.mock("../helpers", () => ({
    getStatusUsingShareCode: jest.fn(),
}));

jest.mock("../play/[share_code]/Lobby", () => {
    return function MockLobby() {
        return <div data-testid="lobby">Lobby Component</div>;
    };
});

jest.mock("../components/PlayPreQuestion", () => {
    return function MockPlayPreQuestion() {
        return (
            <div data-testid="play-pre-question">PlayPreQuestion Component</div>
        );
    };
});

jest.mock("../components/PlayCanvas", () => {
    return function MockPlayCanvas() {
        return <div data-testid="play-canvas">PlayCanvas Component</div>;
    };
});

jest.mock("../components/UsersStatusPanel", () => {
    return function MockUsersStatusPanel() {
        return (
            <div data-testid="users-status-panel">
                UsersStatusPanel Component
            </div>
        );
    };
});

jest.mock("../play/[share_code]/RealtimeContext");
jest.mock("../inside/InsideContext");

const mockGetStatusUsingShareCode = require("../helpers")
    .getStatusUsingShareCode as jest.Mock;
const mockUseRealtimeContext = require("../play/[share_code]/RealtimeContext")
    .useRealtimeContext as jest.Mock;
const mockUseInsideContext = require("../inside/InsideContext")
    .useInsideContext as jest.Mock;

describe("PlayStageContent", () => {
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
            gameData: mockGamesData[1],
        });

        mockUseInsideContext.mockReturnValue({
            games: mockGamesData,
        });
    });

    it("shows error message when no game data", () => {
        mockUseRealtimeContext.mockReturnValue({
            channel: mockChannel,
            gameData: null,
        });
        mockGetStatusUsingShareCode.mockReturnValue({
            status: "whatever",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(
            screen.getByText("Play stage content could not load.")
        ).toBeInTheDocument();
        expect(screen.queryByTestId("lobby")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("users-status-panel")
        ).not.toBeInTheDocument();
    });

    it("shows error message when no channel", () => {
        mockUseRealtimeContext.mockReturnValue({
            channel: null,
            gameData: mockGamesData[1],
        });
        mockGetStatusUsingShareCode.mockReturnValue({ status: "whatever" });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(
            screen.getByText("Play stage content could not load.")
        ).toBeInTheDocument();
        expect(screen.queryByTestId("lobby")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("users-status-panel")
        ).not.toBeInTheDocument();
    });

    it("renders Lobby component when status is 'not started'", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(screen.getByTestId("lobby")).toBeInTheDocument();
        expect(screen.getByTestId("users-status-panel")).toBeInTheDocument();
        expect(
            screen.queryByTestId("play-pre-question")
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId("play-canvas")).not.toBeInTheDocument();
    });

    it("renders PlayPreQuestion component when status is 'pre-question'", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 1,
            status: "pre-question",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(screen.getByTestId("play-pre-question")).toBeInTheDocument();
        expect(screen.getByTestId("users-status-panel")).toBeInTheDocument();
        expect(screen.queryByTestId("lobby")).not.toBeInTheDocument();
        expect(screen.queryByTestId("play-canvas")).not.toBeInTheDocument();
    });

    it("renders PlayCanvas component when status is 'ranking'", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 1,
            status: "ranking",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(screen.getByTestId("play-canvas")).toBeInTheDocument();
        expect(screen.getByTestId("users-status-panel")).toBeInTheDocument();
        expect(screen.queryByTestId("lobby")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("play-pre-question")
        ).not.toBeInTheDocument();
    });

    it("renders nothing when status is 'ended'", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "ended",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(screen.queryByTestId("lobby")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("play-pre-question")
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId("play-canvas")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("users-status-panel")
        ).not.toBeInTheDocument();
    });

    it("renders nothing when status is unknown", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "unknown-status",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(screen.queryByTestId("lobby")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("play-pre-question")
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId("play-canvas")).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("users-status-panel")
        ).not.toBeInTheDocument();
    });

    it("applies correct CSS classes to container divs", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        const container = screen.getByTestId("lobby").parentElement;
        expect(container).toHaveClass("flex", "flex-row", "w-full", "flex-1");
    });

    it("calls getStatusUsingShareCode with correct games data", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(mockGetStatusUsingShareCode).toHaveBeenCalledTimes(1);
        expect(mockGetStatusUsingShareCode).toHaveBeenCalledWith(mockGamesData);
    });

    it("uses RealtimeContext correctly", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(mockUseRealtimeContext).toHaveBeenCalledTimes(1);
    });

    it("uses InsideContext correctly", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(mockUseInsideContext).toHaveBeenCalledTimes(1);
    });

    it("handles different round numbers correctly", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 3,
            status: "pre-question",
        });

        render(<PlayStageContent />, { wrapper: createWrapper() });

        expect(screen.getByTestId("play-pre-question")).toBeInTheDocument();
        expect(screen.getByTestId("users-status-panel")).toBeInTheDocument();
    });

    it("maintains consistent layout structure across different states", () => {
        const statuses = ["not started", "pre-question", "ranking"];

        statuses.forEach((status) => {
            mockGetStatusUsingShareCode.mockReturnValue({
                round: status === "not started" ? null : 1,
                status,
            });

            const { unmount } = render(<PlayStageContent />, {
                wrapper: createWrapper(),
            });

            if (status !== "ended" && status !== "unknown") {
                const usersStatusPanel =
                    screen.getByTestId("users-status-panel");
                expect(usersStatusPanel).toBeInTheDocument();

                const container = usersStatusPanel.parentElement;
                expect(container).toHaveClass(
                    "flex",
                    "flex-row",
                    "w-full",
                    "flex-1"
                );
            }

            unmount();
        });
    });

    it("renders fragment wrapper correctly", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        const { container } = render(<PlayStageContent />, {
            wrapper: createWrapper(),
        });

        expect(container.firstChild?.nodeName.toLowerCase()).toBe("div");
        expect(container.firstChild).toHaveClass(
            "flex",
            "flex-row",
            "w-full",
            "flex-1"
        );
    });
});
