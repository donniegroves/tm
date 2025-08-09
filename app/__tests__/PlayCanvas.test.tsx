import { act, fireEvent, render, screen } from "@testing-library/react";
import PlayCanvas from "../components/PlayCanvas";
import { useIsMaster } from "../hooks/useIsMaster";
import { createWrapper } from "./helpers/createWrapper";
import {
    defaultInsideContextValues,
    defaultRealtimeContextValues,
} from "./helpers/helpers";

jest.mock("../hooks/useIsMaster", () => ({
    useIsMaster: jest.fn(),
}));

jest.mock("../components/IconSvg", () => ({
    Cursor: ({ size }: { size: number }) => (
        <div data-testid="cursor-svg" data-size={size}>
            Cursor SVG
        </div>
    ),
    UpDownArrowSvg: ({ size }: { size: number }) => (
        <div data-testid="up-down-arrow-svg" data-size={size}>
            UpDown Arrow SVG
        </div>
    ),
}));

jest.mock("../components/Ranker", () => {
    return function MockRanker({ preAnswers }: { preAnswers: any[] }) {
        return (
            <div data-testid="ranker" data-answers-count={preAnswers.length}>
                Mock Ranker Component
            </div>
        );
    };
});

const mockUseIsMaster = useIsMaster as jest.Mock;

describe("PlayCanvas", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUser: { user_id: "user1" },
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders the main UI elements", () => {
        render(<PlayCanvas />, { wrapper: createWrapper() });

        expect(screen.getByText("Rank time!")).toBeInTheDocument();
        expect(screen.getByText("Best goes here")).toBeInTheDocument();
        expect(screen.getByText("Worst goes here")).toBeInTheDocument();
        expect(screen.getByTestId("ranker")).toBeInTheDocument();
        expect(screen.getByTestId("up-down-arrow-svg")).toBeInTheDocument();
    });

    it("renders Ranker component with preAnswers", () => {
        const mockPreAnswers = [
            {
                answer: "Answer 1",
                created_at: "2025-01-01T00:00:00Z",
                game_id: 1,
                question_id: 1,
                updated_at: null,
                user_id: "user1",
            },
            {
                answer: "Answer 2",
                created_at: "2025-01-01T00:00:00Z",
                game_id: 1,
                question_id: 1,
                updated_at: null,
                user_id: "user2",
            },
        ];

        render(<PlayCanvas />, {
            wrapper: createWrapper({
                ...defaultInsideContextValues,
                preAnswers: mockPreAnswers,
            }),
        });

        const ranker = screen.getByTestId("ranker");
        expect(ranker).toHaveAttribute("data-answers-count", "2");
    });

    it("scales UpDownArrowSvg size based on preAnswers length", () => {
        const mockPreAnswers = Array.from({ length: 6 }, (_, i) => ({
            answer: `Answer ${i + 1}`,
            created_at: "2025-01-01T00:00:00Z",
            game_id: 1,
            question_id: 1,
            updated_at: null,
            user_id: `user${i + 1}`,
        }));

        render(<PlayCanvas />, {
            wrapper: createWrapper({
                ...defaultInsideContextValues,
                preAnswers: mockPreAnswers,
            }),
        });

        const upDownArrow = screen.getByTestId("up-down-arrow-svg");
        // Expected size: 72 * ((6 * 1.25) / 3) = 72 * 2.5 = 180
        expect(upDownArrow).toHaveAttribute("data-size", "180");
    });

    it("renders cursor when cursor prop is provided and user is not master", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: false,
            currentMasterUser: { user_id: "user2" },
        });

        render(<PlayCanvas />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                cursor: { x: 100, y: 150 },
            }),
        });

        const cursorSvg = screen.getByTestId("cursor-svg");
        expect(cursorSvg).toBeInTheDocument();
        expect(cursorSvg).toHaveAttribute("data-size", "20");

        const cursorDiv = cursorSvg.parentElement;
        expect(cursorDiv).toHaveStyle({
            left: "100px",
            top: "150px",
            transform: "translate(-50%, -50%)",
        });
    });

    it("does not render cursor when user is master", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUser: { user_id: "user1" },
        });

        render(<PlayCanvas />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                cursor: { x: 100, y: 150 },
            }),
        });

        expect(screen.queryByTestId("cursor-svg")).not.toBeInTheDocument();
    });

    it("does not render cursor when cursor prop is null", () => {
        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });
        expect(screen.queryByTestId("cursor-svg")).not.toBeInTheDocument();
    });

    it("sends cursor position immediately when mouse moves and enough time has passed (master user)", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUser: { user_id: "user1" },
        });

        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        const trackingDiv = screen.getByText("Rank time!").parentElement;
        expect(trackingDiv).toBeInTheDocument();

        if (trackingDiv) {
            trackingDiv.getBoundingClientRect = jest.fn(() => ({
                left: 10,
                top: 20,
                width: 400,
                height: 300,
                right: 410,
                bottom: 320,
                x: 10,
                y: 20,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseMove(trackingDiv, {
                clientX: 110,
                clientY: 170,
            });

            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledWith({
                type: "broadcast",
                event: "cursor-pos",
                payload: { x: 100, y: 150 },
            });
        }
    });

    it("does not send cursor position when user is not master", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: false,
            currentMasterUser: { user_id: "user2" },
        });

        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        const trackingDiv = screen.getByText("Rank time!").parentElement;

        if (trackingDiv) {
            trackingDiv.getBoundingClientRect = jest.fn(() => ({
                left: 10,
                top: 20,
                width: 400,
                height: 300,
                right: 410,
                bottom: 320,
                x: 10,
                y: 20,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseMove(trackingDiv, {
                clientX: 110,
                clientY: 170,
            });

            expect(
                defaultRealtimeContextValues.channel?.send
            ).not.toHaveBeenCalled();
        }
    });

    it("throttles mouse move events within debounce delay", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUser: { user_id: "user1" },
        });

        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        const trackingDiv = screen.getByText("Rank time!").parentElement;

        if (trackingDiv) {
            trackingDiv.getBoundingClientRect = jest.fn(() => ({
                left: 0,
                top: 0,
                width: 400,
                height: 300,
                right: 400,
                bottom: 300,
                x: 0,
                y: 0,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseMove(trackingDiv, { clientX: 50, clientY: 50 });
            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledTimes(1);

            fireEvent.mouseMove(trackingDiv, { clientX: 60, clientY: 60 });
            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledTimes(1);

            act(() => {
                jest.advanceTimersByTime(75);
            });

            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledTimes(2);
            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenLastCalledWith({
                type: "broadcast",
                event: "cursor-pos",
                payload: { x: 60, y: 60 },
            });
        }
    });

    it("sends pending position via interval when mouse stops moving", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUser: { user_id: "user1" },
        });

        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        const trackingDiv = screen.getByText("Rank time!").parentElement;

        if (trackingDiv) {
            trackingDiv.getBoundingClientRect = jest.fn(() => ({
                left: 0,
                top: 0,
                width: 400,
                height: 300,
                right: 400,
                bottom: 300,
                x: 0,
                y: 0,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseMove(trackingDiv, { clientX: 75, clientY: 25 });
            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledTimes(1);

            fireEvent.mouseMove(trackingDiv, { clientX: 80, clientY: 30 });
            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledTimes(1);

            act(() => {
                jest.advanceTimersByTime(75);
            });

            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenCalledTimes(2);
            expect(
                defaultRealtimeContextValues.channel?.send
            ).toHaveBeenLastCalledWith({
                type: "broadcast",
                event: "cursor-pos",
                payload: { x: 80, y: 30 },
            });
        }
    });

    it("does not send when channel is null", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUser: { user_id: "user1" },
        });

        render(<PlayCanvas />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                channel: null,
            }),
        });

        const trackingDiv = screen.getByText("Rank time!").parentElement;

        if (trackingDiv) {
            trackingDiv.getBoundingClientRect = jest.fn(() => ({
                left: 0,
                top: 0,
                width: 400,
                height: 300,
                right: 400,
                bottom: 300,
                x: 0,
                y: 0,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseMove(trackingDiv, { clientX: 100, clientY: 100 });
        }

        expect(
            defaultRealtimeContextValues.channel?.send
        ).not.toHaveBeenCalled();
    });

    it("cleans up interval on unmount", () => {
        const clearIntervalSpy = jest.spyOn(global, "clearInterval");

        const { unmount } = render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();

        clearIntervalSpy.mockRestore();
    });
});
