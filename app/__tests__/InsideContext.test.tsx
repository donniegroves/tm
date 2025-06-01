import { render, screen } from "@testing-library/react";
import {
    InsideContextProvider,
    useInsideContext,
} from "../inside/InsideContext";
import {
    mockAllUsers,
    mockGamesData,
    mockPublicUserRow,
    mockQuestionsData,
} from "../test-helpers";

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

type UseQueryArgs = { queryKey: string[] };

function TestComponent() {
    const context = useInsideContext();
    return (
        <div>
            <div data-testid="user-id">{context.loggedInUserId}</div>
            <div data-testid="user-name">{context.allUsers[0]?.full_name}</div>
            <div data-testid="game-id">{context.games[0]?.id}</div>
            <div data-testid="question-pre">
                {context.questions[0]?.pre_question}
            </div>
        </div>
    );
}

describe("InsideContextProvider", () => {
    beforeEach(() => {
        const useQuery = jest.requireMock("@tanstack/react-query")
            .useQuery as jest.Mock;
        useQuery.mockImplementation((args: UseQueryArgs) => {
            switch (args.queryKey[0]) {
                case "loggedInUserId":
                    return { data: mockPublicUserRow.user_id };
                case "allUsers":
                    return { data: mockAllUsers };
                case "games":
                    return { data: mockGamesData };
                case "questions":
                    return { data: mockQuestionsData };
                default:
                    return { data: undefined };
            }
        });
    });

    it("provides context values from queries", () => {
        render(
            <InsideContextProvider>
                <TestComponent />
            </InsideContextProvider>
        );
        expect(screen.getByTestId("user-id")).toHaveTextContent(
            mockPublicUserRow.user_id
        );
        expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
        expect(screen.getByTestId("game-id")).toHaveTextContent("1");
        expect(screen.getByTestId("question-pre")).toHaveTextContent(
            "What is your name?"
        );
    });

    it("returns null if any query is undefined", () => {
        const useQuery = jest.requireMock("@tanstack/react-query")
            .useQuery as jest.Mock;
        useQuery.mockImplementation((args: UseQueryArgs) => {
            if (args.queryKey[0] === "games") return { data: undefined };
            return { data: "ok" };
        });
        const { container } = render(
            <InsideContextProvider>
                <TestComponent />
            </InsideContextProvider>
        );
        expect(container.firstChild).toBeNull();
    });

    it("throws if used outside provider", () => {
        function ThrowingComponent() {
            useInsideContext();
            return null;
        }
        expect(() => render(<ThrowingComponent />)).toThrow(
            /useInsideContext must be used within a InsideContextProvider/
        );
    });
});
