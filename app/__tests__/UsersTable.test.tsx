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
        games: mockGamesData,
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

        const checkboxes = screen.queryAllByRole(
            "checkbox"
        ) as HTMLInputElement[];
        expect(checkboxes.length).toBeGreaterThan(0);
        expect(checkboxes.filter((cb) => cb.checked)).toHaveLength(1);

        const img = screen
            .getAllByRole("img")
            .find(
                (img) =>
                    img.getAttribute("src") === "https://example.com/avatar.png"
            );
        expect(img).toBeDefined();
    });
});
