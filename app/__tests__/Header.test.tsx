import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import { mockPublicUserRow } from "../test-helpers";

describe("Header", () => {
    it("renders the header with user information", () => {
        render(<Header loggedInUser={mockPublicUserRow} />);

        expect(
            screen.getByText(mockPublicUserRow.full_name ?? "garbage")
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicUserRow.username ?? "garbage")
        ).toBeInTheDocument();
        expect(
            screen.getByTitle(
                `${mockPublicUserRow.user_id} / ${mockPublicUserRow.access_level}`
            )
        ).toBeInTheDocument();
        expect(screen.getByRole("img", { name: "Test User" })).toHaveAttribute(
            "src",
            "https://example.com/avatar.png"
        );
    });
    it("renders the header with fallback avatar and name if missing", () => {
        const userWithoutAvatarOrName = {
            ...mockPublicUserRow,
            avatar_url: null,
            full_name: null,
        };
        render(<Header loggedInUser={userWithoutAvatarOrName} />);

        const avatarImg = screen.getByLabelText("avatar");
        expect(avatarImg).not.toHaveAttribute("src");
    });
});
