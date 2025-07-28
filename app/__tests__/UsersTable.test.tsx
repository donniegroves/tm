import { render, screen } from "@testing-library/react";
import UsersTable from "../components/UsersTable";
import { InsideContextType } from "../inside/InsideContext";
import {
    mockGamesData,
    mockPublicUserRow,
    mockQuestionsData,
} from "./helpers/helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: (): InsideContextType => ({
        loggedInUserId: mockPublicUserRow.user_id,
        allUsers: [mockPublicUserRow],
        games: mockGamesData,
        questions: mockQuestionsData,
        gameUsers: [],
        gameQuestions: [],
    }),
}));

describe("UsersTable", () => {
    it("renders users in the table", () => {
        render(<UsersTable />);

        expect(screen.getByRole("grid", { name: "Users" })).toBeInTheDocument();
        expect(screen.getByText("user1")).toBeInTheDocument();
        expect(screen.getByText("testuser1")).toBeInTheDocument();
        expect(screen.getByText("Test User 1")).toBeInTheDocument();
        expect(screen.getByText("testuser1@example.com")).toBeInTheDocument();

        const img = screen
            .getAllByRole("img")
            .find(
                (img) =>
                    img.getAttribute("src") ===
                    "https://example.com/avatar1.png"
            );
        expect(img).toBeDefined();
    });
});
