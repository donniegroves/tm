import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteQuestion } from "../actions/deleteQuestion";
import QuestionsTable from "../components/QuestionsTable";

jest.mock("../actions/deleteQuestion", () => ({
    deleteQuestion: jest.fn(),
}));

const mockQuestions = [
    { id: 765, pre_question: "What is your name?", rank_prompt: "Rank 1" },
    { id: 456, pre_question: "What is your quest?", rank_prompt: "Rank 2" },
];

describe("QuestionsTable", () => {
    it("renders questions in the table", () => {
        render(<QuestionsTable questions={mockQuestions} />);
        expect(screen.getByText("What is your name?")).toBeInTheDocument();
        expect(screen.getByText("What is your quest?")).toBeInTheDocument();
        expect(screen.getAllByText("Del").length).toBe(2);
    });

    it("calls deleteQuestion when Del button is pressed", async () => {
        render(<QuestionsTable questions={mockQuestions} />);
        const delButtons = screen.getAllByText("Del");
        fireEvent.click(delButtons[1]);
        await waitFor(() => {
            expect(deleteQuestion).toHaveBeenCalledWith(456);
        });
    });
});
