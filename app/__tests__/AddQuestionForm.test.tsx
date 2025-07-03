import { render, screen } from "@testing-library/react";
import AddQuestionForm from "../components/AddQuestionForm";

describe("AddQuestionForm", () => {
    it("renders the form and its inputs", () => {
        render(<AddQuestionForm />);

        const form = screen.getByRole("form");
        expect(form).toBeInTheDocument();

        const questionInput = screen.getByLabelText(/question/i);
        expect(questionInput).toBeInTheDocument();
        expect(questionInput).toHaveValue("What's your favorite color?");

        const rankPromptInput = screen.getByLabelText(/rank prompt/i);
        expect(rankPromptInput).toBeInTheDocument();
        expect(rankPromptInput).toHaveValue(
            "Rank these from most to least favorite"
        );
    });
});
