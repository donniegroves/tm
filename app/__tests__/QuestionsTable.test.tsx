import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteQuestion } from "../actions/deleteQuestion";
import { insertQuestion } from "../actions/insertQuestion";
import QuestionsTable from "../components/QuestionsTable";
import { mockPublicQuestionRow } from "../test-helpers";

jest.mock("../actions/deleteQuestion", () => ({
    deleteQuestion: jest.fn(),
}));
jest.mock("../actions/insertQuestion", () => ({
    insertQuestion: jest.fn(),
}));

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({
        questions: [
            mockPublicQuestionRow,
            {
                ...mockPublicQuestionRow,
                id: 456,
                pre_question: "What is your quest?",
            },
        ],
    }),
}));

describe("QuestionsTable", () => {
    it("renders questions in the table", () => {
        render(<QuestionsTable />);
        expect(screen.getByText("What is your name?")).toBeInTheDocument();
        expect(screen.getByText("What is your quest?")).toBeInTheDocument();
        expect(screen.getAllByText("Del").length).toBe(2);
    });

    it("calls deleteQuestion when Del button is pressed", async () => {
        render(<QuestionsTable />);
        const delButtons = screen.getAllByText("Del");
        fireEvent.click(delButtons[1]);
        await waitFor(() => {
            expect(deleteQuestion).toHaveBeenCalledWith(456);
        });
    });

    it("calls insertQuestion when Add random question button is pressed", async () => {
        render(<QuestionsTable />);

        const insertButton = screen.getByRole("button", {
            name: "Add random question",
        });
        expect(insertButton).toBeInTheDocument();

        fireEvent.click(insertButton);

        await waitFor(() => {
            expect(insertQuestion).toHaveBeenCalledTimes(1);
        });
    });
});
