import { render, screen } from "@testing-library/react";
import PlayPreQuestion from "../components/PlayPreQuestion";
import { createWrapper } from "./helpers/createWrapper";
import {
    mockGameQuestionsData,
    mockGamesData,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../helpers", () => ({
    getStatusUsingShareCode: jest.fn(),
}));

jest.mock("../inside/InsideContext");
jest.mock("../play/[share_code]/RealtimeContext");

const mockGetStatusUsingShareCode = require("../helpers")
    .getStatusUsingShareCode as jest.Mock;
const mockUseInsideContext = require("../inside/InsideContext")
    .useInsideContext as jest.Mock;
const mockUseRealtimeContext = require("../play/[share_code]/RealtimeContext")
    .useRealtimeContext as jest.Mock;

describe("PlayPreQuestion", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockGetStatusUsingShareCode.mockReturnValue({
            round: 2,
            status: "pre-question",
        });

        mockUseInsideContext.mockReturnValue({
            questions: mockQuestionsData,
            gameQuestions: mockGameQuestionsData,
            games: mockGamesData,
        });

        mockUseRealtimeContext.mockReturnValue({
            gameData: mockGamesData[1],
        });
    });

    it("renders question when found", () => {
        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(screen.getByText("PreQuestion!")).toBeInTheDocument();
        expect(screen.getByText("Question here:")).toBeInTheDocument();
        expect(
            screen.getByText(mockQuestionsData[1].pre_question)
        ).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("finds correct game question based on round and game ID", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 1,
            status: "pre-question",
        });

        mockUseRealtimeContext.mockReturnValue({
            gameData: mockGamesData[0],
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(
            screen.getByText(mockQuestionsData[0].pre_question)
        ).toBeInTheDocument();
    });

    it("handles different rounds correctly", () => {
        mockGetStatusUsingShareCode.mockReturnValue({
            round: 2,
            status: "pre-question",
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(
            screen.getByText(mockQuestionsData[1].pre_question)
        ).toBeInTheDocument();
    });

    it("renders with correct CSS classes", () => {
        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        const mainContainer = screen.getByText("PreQuestion!").parentElement;
        expect(mainContainer).toHaveClass(
            "flex-1",
            "flex",
            "flex-col",
            "items-center",
            "justify-center"
        );

        const title = screen.getByText("PreQuestion!");
        expect(title).toHaveClass("text-2xl", "font-bold", "mb-4");

        const questionContainer =
            screen.getByText("Question here:").parentElement;
        expect(questionContainer).toHaveClass(
            "relative",
            "border",
            "border-gray-300",
            "w-[400px]",
            "h-[300px]"
        );
    });

    it("calls getStatusUsingShareCode with correct games data", () => {
        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(mockGetStatusUsingShareCode).toHaveBeenCalledTimes(1);
        expect(mockGetStatusUsingShareCode).toHaveBeenCalledWith(mockGamesData);
    });

    it("uses InsideContext correctly", () => {
        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(mockUseInsideContext).toHaveBeenCalledTimes(1);
    });

    it("uses RealtimeContext correctly", () => {
        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(mockUseRealtimeContext).toHaveBeenCalledTimes(1);
    });

    it("renders text input field", () => {
        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        const input = screen.getByRole("textbox");
        expect(input).toBeInTheDocument();
        expect(input.tagName.toLowerCase()).toBe("input");
        expect(input).toHaveAttribute("type", "text");
    });

    it("handles multiple questions and finds the correct one", () => {
        const additionalQuestions = [
            ...mockQuestionsData,
            {
                id: 999,
                pre_question: "Additional question",
                rank_prompt: "Additional ranking prompt",
                created_at: "2024-06-03T12:00:00Z",
                updated_at: "2024-06-03T12:00:00Z",
            },
        ];

        const additionalGameQuestions = [
            ...mockGameQuestionsData,
            {
                game_id: mockGamesData[1].id,
                round: 3,
                question_id: 999,
                created_at: "2024-06-03T12:00:00Z",
                updated_at: "2024-06-03T12:00:00Z",
            },
        ];

        mockGetStatusUsingShareCode.mockReturnValue({
            round: 3,
            status: "pre-question",
        });

        mockUseInsideContext.mockReturnValue({
            questions: additionalQuestions,
            gameQuestions: additionalGameQuestions,
            games: mockGamesData,
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(screen.getByText("Additional question")).toBeInTheDocument();
        expect(
            screen.queryByText(mockQuestionsData[0].pre_question)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(mockQuestionsData[1].pre_question)
        ).not.toBeInTheDocument();
    });
});
