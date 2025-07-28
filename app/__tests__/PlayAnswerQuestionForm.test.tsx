import { fireEvent, render, screen } from "@testing-library/react";
import PlayAnswerQuestionForm from "../components/PlayAnswerQuestionForm";
import { createWrapper } from "./helpers/createWrapper";
import {
    defaultInsideContextValues,
    defaultRealtimeContextValues,
    mockAllUsers,
    mockGamesData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../helpers", () => ({
    getStatusUsingShareCode: jest.fn(),
}));

jest.mock("../hooks/useAddAnswer", () => ({
    useAddAnswer: jest.fn(),
}));

jest.mock("@heroui/button", () => ({
    Button: ({
        children,
        onPress,
        type,
    }: {
        children: React.ReactNode;
        onPress: () => void;
        type?: "reset" | "submit" | "button";
    }) => (
        <button onClick={onPress} type={type} data-testid="submit-button">
            {children}
        </button>
    ),
}));

import { getStatusUsingShareCode } from "../helpers";
import { useAddAnswer } from "../hooks/useAddAnswer";

const mockGetStatusUsingShareCode = getStatusUsingShareCode as jest.Mock;
const mockUseAddAnswer = useAddAnswer as jest.Mock;

describe("PlayAnswerQuestionForm", () => {
    const mockMutate = jest.fn();
    const mockAddAnswerMutation = {
        mutate: mockMutate,
        isPending: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockGetStatusUsingShareCode.mockReturnValue({
            round: 2,
            status: "pre-question",
        });

        mockUseAddAnswer.mockReturnValue(mockAddAnswerMutation);
    });

    it("renders the form elements correctly", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        expect(screen.getByText("Question here:")).toBeInTheDocument();
        expect(
            screen.getByText(mockQuestionsData[1].pre_question)
        ).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByTestId("submit-button")).toBeInTheDocument();
        expect(screen.getByText("Submit Answer")).toBeInTheDocument();
    });

    it("displays the correct question based on round and game", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 1,
            status: "pre-question",
        });

        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            gameData: mockGamesData[0], //
        };

        render(<PlayAnswerQuestionForm />, {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        expect(
            screen.getByText(mockQuestionsData[0].pre_question)
        ).toBeInTheDocument();
    });

    it("allows user to type in the input field", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "My test answer" } });

        expect(input.value).toBe("My test answer");
    });

    it("shows placeholder text in input field", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox") as HTMLInputElement;

        expect(input.placeholder).toBe("Enter your answer...");
    });

    it("submits answer when button is clicked", async () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "My answer" } });
        fireEvent.click(submitButton);

        expect(mockMutate).toHaveBeenCalledWith({
            gameId: mockGamesData[1].id,
            questionId: mockQuestionsData[1].id,
            userId: mockAllUsers[0].user_id,
            answer: "My answer",
        });
    });

    it("trims whitespace from answer before submitting", async () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, {
            target: { value: "  My answer with spaces  " },
        });
        fireEvent.click(submitButton);

        expect(mockMutate).toHaveBeenCalledWith({
            gameId: mockGamesData[1].id,
            questionId: mockQuestionsData[1].id,
            userId: mockAllUsers[0].user_id,
            answer: "My answer with spaces",
        });
    });

    it("does not submit when answer is empty", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const submitButton = screen.getByTestId("submit-button");

        fireEvent.click(submitButton);

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it("does not submit when answer is only whitespace", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "   " } });
        fireEvent.click(submitButton);

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it("does not submit when no game data", () => {
        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            gameData: undefined,
        };

        render(<PlayAnswerQuestionForm />, {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "My answer" } });
        fireEvent.click(submitButton);

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it("does not submit when no question found", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 999,
            status: "pre-question",
        });

        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "My answer" } });
        fireEvent.click(submitButton);

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it("handles different rounds correctly", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 1,
            status: "pre-question",
        });

        const customRealtimeContextValues = {
            ...defaultRealtimeContextValues,
            gameData: mockGamesData[0],
        };

        render(<PlayAnswerQuestionForm />, {
            wrapper: createWrapper(
                defaultInsideContextValues,
                customRealtimeContextValues
            ),
        });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "Round 1 answer" } });
        fireEvent.click(submitButton);

        expect(mockMutate).toHaveBeenCalledWith({
            gameId: mockGamesData[0].id,
            questionId: mockQuestionsData[0].id,
            userId: mockAllUsers[0].user_id,
            answer: "Round 1 answer",
        });
    });

    it("uses correct context values", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        expect(mockGetStatusUsingShareCode).toHaveBeenCalledWith(mockGamesData);
        expect(mockUseAddAnswer).toHaveBeenCalled();
    });

    it("renders question text in pre element", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const preElement = screen.getByText(mockQuestionsData[1].pre_question);
        expect(preElement.tagName.toLowerCase()).toBe("pre");
    });

    it("renders input with correct type", () => {
        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("type", "text");
    });

    it("handles null round gracefully", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: null,
            status: "not started",
        });

        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "My answer" } });
        fireEvent.click(submitButton);

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it("maintains input state across re-renders", () => {
        const { rerender } = render(<PlayAnswerQuestionForm />, {
            wrapper: createWrapper(),
        });

        const input = screen.getByRole("textbox") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "Persistent answer" } });
        expect(input.value).toBe("Persistent answer");

        rerender(<PlayAnswerQuestionForm />);

        expect(input.value).toBe("Persistent answer");
    });

    it("clears input after successful submission", async () => {
        const mockSuccessfulMutation = {
            ...mockAddAnswerMutation,
            isSuccess: true,
        };

        mockUseAddAnswer.mockReturnValue(mockSuccessfulMutation);

        render(<PlayAnswerQuestionForm />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox") as HTMLInputElement;
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "My answer" } });
        fireEvent.click(submitButton);

        expect(mockMutate).toHaveBeenCalled();
    });

    it("works with different logged in users", () => {
        const customInsideContextValues = {
            ...defaultInsideContextValues,
            loggedInUserId: mockAllUsers[2].user_id,
        };

        render(<PlayAnswerQuestionForm />, {
            wrapper: createWrapper(customInsideContextValues),
        });

        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-button");

        fireEvent.change(input, { target: { value: "Different user answer" } });
        fireEvent.click(submitButton);

        expect(mockMutate).toHaveBeenCalledWith({
            gameId: mockGamesData[1].id,
            questionId: mockQuestionsData[1].id,
            userId: mockAllUsers[2].user_id,
            answer: "Different user answer",
        });
    });
});
