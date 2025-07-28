import { render, screen } from "@testing-library/react";
import PlayPreQuestion from "../components/PlayPreQuestion";
import { useIsMaster } from "../hooks/useIsMaster";
import { createWrapper } from "./helpers/createWrapper";

jest.mock("../hooks/useIsMaster", () => ({
    useIsMaster: jest.fn(),
}));

jest.mock("../components/PlayAnswerQuestionForm", () => {
    return function MockPlayAnswerQuestionForm() {
        return <div>PlayAnswerQuestionForm Component</div>;
    };
});

const mockUseIsMaster = useIsMaster as jest.Mock;

describe("PlayPreQuestion", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the main heading", () => {
        mockUseIsMaster.mockReturnValue(false);

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(screen.getByText("PreQuestion time!")).toBeInTheDocument();
    });

    it("shows master message when user is master", () => {
        mockUseIsMaster.mockReturnValue(true);

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(screen.getByText("You are the master!")).toBeInTheDocument();
        expect(
            screen.queryByText("PlayAnswerQuestionForm Component")
        ).not.toBeInTheDocument();
    });

    it("shows PlayAnswerQuestionForm when user is not master", () => {
        mockUseIsMaster.mockReturnValue(false);

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(
            screen.getByText("PlayAnswerQuestionForm Component")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("You are the master!")
        ).not.toBeInTheDocument();
    });
});
