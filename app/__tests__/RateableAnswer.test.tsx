import { act, fireEvent, render, screen } from "@testing-library/react";
import { RatedPreAnswer } from "../components/Ranker";
import RateableAnswer from "../components/RateableAnswer";
import { createWrapper } from "./helpers/createWrapper";
import { defaultInsideContextValues } from "./helpers/helpers";

jest.mock("../components/IconSvg", () => ({
    UpArrow2Svg: ({ size }: { size: number }) => (
        <div data-testid="up-arrow-svg" data-size={size}>
            Up Arrow
        </div>
    ),
    DownArrow2Svg: ({ size }: { size: number }) => (
        <div data-testid="down-arrow-svg" data-size={size}>
            Down Arrow
        </div>
    ),
}));

jest.mock("@heroui/avatar", () => ({
    Avatar: ({ size, src }: { size: string; src: string }) => (
        <div data-testid="avatar" data-size={size} data-src={src}>
            Avatar
        </div>
    ),
}));

describe("RateableAnswer", () => {
    const mockSetRatedPreAnswers = jest.fn();

    const mockRatedPreAnswers: RatedPreAnswer[] = [
        {
            answer: "First answer",
            created_at: "2025-01-01T00:00:00Z",
            game_id: 1,
            question_id: 1,
            updated_at: null,
            user_id: "user1",
            rating: 1,
        },
        {
            answer: "Second answer",
            created_at: "2025-01-01T00:00:00Z",
            game_id: 1,
            question_id: 1,
            updated_at: null,
            user_id: "user2",
            rating: 2,
        },
        {
            answer: "Third answer",
            created_at: "2025-01-01T00:00:00Z",
            game_id: 1,
            question_id: 1,
            updated_at: null,
            user_id: "user3",
            rating: 3,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders answer text and user avatar", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText("First answer")).toBeInTheDocument();
        expect(screen.getByTestId("avatar")).toBeInTheDocument();
    });

    it("displays up arrow when not at highest rating", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByTestId("up-arrow-svg")).toBeInTheDocument();
    });

    it("hides up arrow when at highest rating", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[2]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.queryByTestId("up-arrow-svg")).not.toBeInTheDocument();
    });

    it("displays down arrow when not at lowest rating", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[2]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByTestId("down-arrow-svg")).toBeInTheDocument();
    });

    it("hides down arrow when at lowest rating", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.queryByTestId("down-arrow-svg")).not.toBeInTheDocument();
    });

    it("calls setRatedPreAnswers when up arrow is clicked", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        const upButton = screen.getByTestId("up-arrow-svg").parentElement;
        if (upButton) {
            fireEvent.click(upButton);
        }

        expect(mockSetRatedPreAnswers).toHaveBeenCalledTimes(1);
    });

    it("calls setRatedPreAnswers when down arrow is clicked", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[2]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        const downButton = screen.getByTestId("down-arrow-svg").parentElement;
        if (downButton) {
            fireEvent.click(downButton);
        }

        expect(mockSetRatedPreAnswers).toHaveBeenCalledTimes(1);
    });

    it("triggers animation when ranking changes", () => {
        const { container } = render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        const answerContainer = container.firstChild as HTMLElement;
        expect(answerContainer).not.toHaveClass("scale-105");

        const upButton = screen.getByTestId("up-arrow-svg").parentElement;
        if (upButton) {
            fireEvent.click(upButton);
        }

        expect(answerContainer).toHaveClass("scale-105");

        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(answerContainer).not.toHaveClass("scale-105");
    });

    it("applies correct CSS classes during animation", () => {
        const { container } = render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        const upButton = screen.getByTestId("up-arrow-svg").parentElement;
        if (upButton) {
            fireEvent.click(upButton);
        }

        const answerText = screen.getByText("First answer").parentElement;
        expect(answerText).toHaveClass("font-semibold", "text-white");

        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(answerText).not.toHaveClass("font-semibold", "text-white");
    });

    it("displays correct avatar based on user_id", () => {
        const mockContextWithUsers = {
            ...defaultInsideContextValues,
            allUsers: [
                {
                    user_id: "user1",
                    avatar_url: "https://example.com/avatar1.jpg",
                    access_level: 1,
                    created_at: "2025-01-01T00:00:00Z",
                    email: "user1@example.com",
                    full_name: "User One",
                    timezone: "UTC",
                    updated_at: "2025-01-01T00:00:00Z",
                    username: "user1",
                },
            ],
        };

        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper(mockContextWithUsers) }
        );

        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute(
            "data-src",
            "https://example.com/avatar1.jpg"
        );
        expect(avatar).toHaveAttribute("data-size", "sm");
    });

    it("does not allow ranking beyond bounds", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[2]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.queryByTestId("up-arrow-svg")).not.toBeInTheDocument();
    });

    it("handles ranking change correctly with state update", () => {
        const mockSetFunction = jest.fn((updateFn) => {
            if (typeof updateFn === "function") {
                updateFn(mockRatedPreAnswers);
            }
        });

        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[0]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetFunction}
            />,
            { wrapper: createWrapper() }
        );

        const upButton = screen.getByTestId("up-arrow-svg").parentElement;
        if (upButton) {
            fireEvent.click(upButton);
        }

        expect(mockSetFunction).toHaveBeenCalledWith(expect.any(Function));
    });

    it("applies hover and active states to buttons", () => {
        render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[1]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        const upButton = screen.getByTestId("up-arrow-svg").parentElement;
        const downButton = screen.getByTestId("down-arrow-svg").parentElement;

        expect(upButton).toHaveClass("hover:bg-gray-100", "active:scale-95");
        expect(downButton).toHaveClass("hover:bg-gray-100", "active:scale-95");
    });

    it("renders with proper container layout classes", () => {
        const { container } = render(
            <RateableAnswer
                ratedPreAnswer={mockRatedPreAnswers[1]}
                allRatedPreAnswers={mockRatedPreAnswers}
                setRatedPreAnswers={mockSetRatedPreAnswers}
            />,
            { wrapper: createWrapper() }
        );

        const mainContainer = container.firstChild as HTMLElement;
        expect(mainContainer).toHaveClass(
            "flex",
            "flex-row",
            "items-center",
            "space-x-2",
            "p-2",
            "border",
            "rounded",
            "transition-all",
            "duration-300",
            "ease-in-out"
        );
    });
});
