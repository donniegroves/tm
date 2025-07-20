import { act, fireEvent, render, screen } from "@testing-library/react";
import PlayCanvas from "../components/PlayCanvas";
import { createWrapper } from "./helpers/createWrapper";
import { defaultRealtimeContextValues } from "./helpers/helpers";

jest.mock("../components/IconSvg", () => ({
    MustacheSvg: ({ size }: { size: number }) => (
        <div data-testid="mustache-svg" data-size={size}>
            Mustache SVG
        </div>
    ),
}));

describe("PlayCanvas", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders canvas with correct dimensions", () => {
        render(<PlayCanvas />, { wrapper: createWrapper() });
        const canvas = screen.getByRole("img", { hidden: true });
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveAttribute("width", "400");
        expect(canvas).toHaveAttribute("height", "300");
    });

    it("renders cursor when cursor prop is provided", () => {
        render(<PlayCanvas />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                cursor: { x: 100, y: 150 },
            }),
        });

        const mustacheSvg = screen.getByTestId("mustache-svg");
        expect(mustacheSvg).toBeInTheDocument();
        expect(mustacheSvg).toHaveAttribute("data-size", "32");

        const cursorDiv = mustacheSvg.parentElement;
        expect(cursorDiv).toHaveStyle({
            left: "100px",
            top: "150px",
            transform: "translate(-50%, -50%)",
        });
    });

    it("does not render cursor when cursor prop is null", () => {
        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });
        expect(screen.queryByTestId("mustache-svg")).not.toBeInTheDocument();
    });

    it("sends cursor position immediately when mouse moves and enough time has passed", () => {
        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        const canvas = screen.getByRole("img", { hidden: true });

        canvas.getBoundingClientRect = jest.fn(() => ({
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

        fireEvent.mouseMove(canvas, {
            clientX: 110, // 110 - 10 (left) = 100
            clientY: 170, // 170 - 20 (top) = 150
        });

        expect(defaultRealtimeContextValues.channel?.send).toHaveBeenCalledWith(
            {
                type: "broadcast",
                event: "cursor-pos",
                payload: { x: 100, y: 150 },
            }
        );
    });

    it("throttles mouse move events within debounce delay", () => {
        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        const canvas = screen.getByRole("img", { hidden: true });

        canvas.getBoundingClientRect = jest.fn(() => ({
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

        // First mouse move should send immediately
        fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 });
        expect(
            defaultRealtimeContextValues.channel?.send
        ).toHaveBeenCalledTimes(1);

        // Second mouse move within 75ms should not send immediately
        fireEvent.mouseMove(canvas, { clientX: 60, clientY: 60 });
        expect(
            defaultRealtimeContextValues.channel?.send
        ).toHaveBeenCalledTimes(1);

        // Advance time and trigger interval
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
    });

    it("sends pending position via interval when mouse stops moving", () => {
        render(<PlayCanvas />, {
            wrapper: createWrapper(),
        });

        const canvas = screen.getByRole("img", { hidden: true });

        canvas.getBoundingClientRect = jest.fn(() => ({
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

        // Move mouse to set pending position
        fireEvent.mouseMove(canvas, { clientX: 75, clientY: 25 });
        expect(
            defaultRealtimeContextValues.channel?.send
        ).toHaveBeenCalledTimes(1);

        // Move again quickly (should be throttled)
        fireEvent.mouseMove(canvas, { clientX: 80, clientY: 30 });
        expect(
            defaultRealtimeContextValues.channel?.send
        ).toHaveBeenCalledTimes(1);

        // Advance time to trigger interval
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
    });

    it("does not send when channel is null", () => {
        const { container } = render(<PlayCanvas />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                channel: null,
            }),
        });

        const canvas = container.querySelector("canvas");

        if (canvas) {
            canvas.getBoundingClientRect = jest.fn(() => ({
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

            fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
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
