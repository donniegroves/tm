import { render, screen } from "@testing-library/react";
import UsersTable from "../components/UsersTable";
import { InsideContextType } from "../inside/InsideContext";
import {
    mockGamesData,
    mockPublicUserRow,
    mockQuestionsData,
} from "../test-helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: (): InsideContextType => ({
        loggedInUserId: mockPublicUserRow.user_id,
        allUsers: [mockPublicUserRow],
        gamesData: mockGamesData,
        questions: mockQuestionsData,
    }),
}));

describe("UsersTable", () => {
    it("renders users in the table", () => {
        render(<UsersTable ariaLabel="TestLabel" />);

        expect(
            screen.getByRole("grid", { name: "TestLabel" })
        ).toBeInTheDocument();
        expect(screen.getByText("user1")).toBeInTheDocument();
        expect(screen.getByText("testuser")).toBeInTheDocument();
        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText("testuser@example.com")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(
            screen.getByText("https://example.com/avatar.png")
        ).toBeInTheDocument();
        expect(screen.getByText("America/New_York")).toBeInTheDocument();
    });
});
