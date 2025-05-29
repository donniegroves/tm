import { render, screen } from "@testing-library/react";
import { useInsideContext } from "../inside/InsideContext";
import {
    mockAllUsers,
    mockGamesData,
    mockQuestionsData,
    renderWithContext,
} from "../test-helpers";

describe("InsideContext", () => {
    const TestComponent = () => {
        const context = useInsideContext();
        return (
            <div>
                <p>Logged in user id: {context.loggedInUserId}</p>
                <p>Total users count: {context.allUsers.length}</p>
                <p>Games count: {context.gamesData.length}</p>
                <p>Questions count: {context.questions.length} </p>
            </div>
        );
    };

    it("provides the correct context values", () => {
        renderWithContext(<TestComponent />, {
            allUsers: mockAllUsers,
            gamesData: mockGamesData,
            questions: mockQuestionsData,
        });

        expect(
            screen.getByText(/Logged in user id: user1/)
        ).toBeInTheDocument();
        expect(screen.getByText(/Total users count: 2/)).toBeInTheDocument();
        expect(screen.getByText(/Games count: 2/)).toBeInTheDocument();
        expect(screen.getByText(/Questions count: 2/)).toBeInTheDocument();
    });

    it("throws an error when used outside of the provider", () => {
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        expect(() => render(<TestComponent />)).toThrow(
            "useInsideContext must be used within a InsideContextProvider"
        );

        consoleError.mockRestore();
    });
});
