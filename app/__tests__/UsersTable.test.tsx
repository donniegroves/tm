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

        const checkboxes = screen.queryAllByRole(
            "checkbox"
        ) as HTMLInputElement[];
        expect(checkboxes.length).toBeGreaterThan(0);
        expect(checkboxes.filter((cb) => cb.checked)).toHaveLength(1);

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
