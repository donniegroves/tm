import { render, screen } from "@testing-library/react";
import EditQuestionForm from "../components/EditQuestionForm";

const mockQuestions = [
    {
        id: 1,
        pre_question: "What is your favorite color?",
        rank_prompt: "Rank these colors",
    },
    {
        id: 2,
        pre_question: "What is your quest?",
        rank_prompt: "Rank your quests",
    },
];

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({
        questions: mockQuestions,
    }),
}));

describe("EditQuestionForm", () => {
    it("renders form with current question and rank prompt", () => {
        render(<EditQuestionForm questionId={2} />);
        expect(screen.getByRole("form")).toBeInTheDocument();
        expect(screen.getByLabelText("Question")).toHaveValue(
            "What is your quest?"
        );
        expect(screen.getByLabelText("Rank Prompt")).toHaveValue(
            "Rank your quests"
        );
        expect(screen.getByDisplayValue("2")).toBeInTheDocument(); // hidden input
    });

    it("renders default values if question not found", () => {
        render(<EditQuestionForm questionId={999} />);
        expect(screen.getByLabelText("Question")).toHaveValue(
            "What is your favorite color?"
        );
        expect(screen.getByLabelText("Rank Prompt")).toHaveValue(
            "Rank these from most to least favorite"
        );
        expect(screen.getByDisplayValue("999")).toBeInTheDocument();
    });
});
