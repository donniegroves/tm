import { render, screen } from "@testing-library/react";
import { Database } from "database.types";
import Ranker from "../components/Ranker";

jest.mock("../components/RateableAnswer", () => {
    return function MockRateableAnswer({
        ratedPreAnswer,
        allRatedPreAnswers,
    }: {
        ratedPreAnswer: any;
        allRatedPreAnswers: any[];
    }) {
        return (
            <div
                data-testid="rateable-answer"
                data-answer={ratedPreAnswer.answer}
                data-rating={ratedPreAnswer.rating}
                data-user-id={ratedPreAnswer.user_id}
                data-total-answers={allRatedPreAnswers.length}
            >
                {ratedPreAnswer.answer} (#{ratedPreAnswer.rating})
            </div>
        );
    };
});

describe("Ranker", () => {
    const mockPreAnswers: Database["public"]["Tables"]["pre_answers"]["Row"][] =
        [
            {
                answer: "First answer",
                created_at: "2025-01-01T00:00:00Z",
                game_id: 1,
                question_id: 1,
                updated_at: null,
                user_id: "user1",
            },
            {
                answer: "Second answer",
                created_at: "2025-01-01T00:00:00Z",
                game_id: 1,
                question_id: 1,
                updated_at: null,
                user_id: "user2",
            },
            {
                answer: "Third answer",
                created_at: "2025-01-01T00:00:00Z",
                game_id: 1,
                question_id: 1,
                updated_at: null,
                user_id: "user3",
            },
        ];

    it("renders all pre-answers as RateableAnswer components", () => {
        render(<Ranker preAnswers={mockPreAnswers} />);

        const rateableAnswers = screen.getAllByTestId("rateable-answer");
        expect(rateableAnswers).toHaveLength(3);

        expect(screen.getByText("First answer (#1)")).toBeInTheDocument();
        expect(screen.getByText("Second answer (#2)")).toBeInTheDocument();
        expect(screen.getByText("Third answer (#3)")).toBeInTheDocument();
    });

    it("assigns sequential ratings starting from 1", () => {
        render(<Ranker preAnswers={mockPreAnswers} />);

        const rateableAnswers = screen.getAllByTestId("rateable-answer");

        expect(rateableAnswers[0]).toHaveAttribute("data-rating", "3");
        expect(rateableAnswers[1]).toHaveAttribute("data-rating", "2");
        expect(rateableAnswers[2]).toHaveAttribute("data-rating", "1");
    });

    it("sorts answers by rating in descending order (highest first)", () => {
        render(<Ranker preAnswers={mockPreAnswers} />);

        const rateableAnswers = screen.getAllByTestId("rateable-answer");

        expect(rateableAnswers[0]).toHaveAttribute(
            "data-answer",
            "Third answer"
        );
        expect(rateableAnswers[0]).toHaveAttribute("data-rating", "3");

        expect(rateableAnswers[1]).toHaveAttribute(
            "data-answer",
            "Second answer"
        );
        expect(rateableAnswers[1]).toHaveAttribute("data-rating", "2");

        expect(rateableAnswers[2]).toHaveAttribute(
            "data-answer",
            "First answer"
        );
        expect(rateableAnswers[2]).toHaveAttribute("data-rating", "1");
    });

    it("passes all rated answers to each RateableAnswer component", () => {
        render(<Ranker preAnswers={mockPreAnswers} />);

        const rateableAnswers = screen.getAllByTestId("rateable-answer");

        rateableAnswers.forEach((answer) => {
            expect(answer).toHaveAttribute("data-total-answers", "3");
        });
    });

    it("handles empty preAnswers array", () => {
        render(<Ranker preAnswers={[]} />);

        const rateableAnswers = screen.queryAllByTestId("rateable-answer");
        expect(rateableAnswers).toHaveLength(0);
    });

    it("generates correct keys for RateableAnswer components", () => {
        render(<Ranker preAnswers={mockPreAnswers} />);

        const rateableAnswers = screen.getAllByTestId("rateable-answer");

        expect(rateableAnswers[0]).toHaveAttribute("data-user-id", "user3");
        expect(rateableAnswers[1]).toHaveAttribute("data-user-id", "user2");
        expect(rateableAnswers[2]).toHaveAttribute("data-user-id", "user1");
    });

    it("applies correct CSS classes", () => {
        const { container } = render(<Ranker preAnswers={mockPreAnswers} />);

        const rankerContainer = container.firstChild;
        expect(rankerContainer).toHaveClass("flex", "flex-col", "gap-2");
    });
});
