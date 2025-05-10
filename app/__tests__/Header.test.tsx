import { User } from "@supabase/supabase-js";
import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

const mockUser: User & { access_level: number } = {
    id: "user123",
    email: "test@example.com",
    user_metadata: {
        full_name: "Test User",
        avatar_url: "https://example.com/avatar.png",
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: "2025-05-01T00:00:00.000Z",
    access_level: 1,
};

describe("Header", () => {
    it("renders the header with user information", () => {
        render(<Header loggedInUser={mockUser} />);

        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
        expect(screen.getByTitle("user123 / 1")).toBeInTheDocument();
        expect(screen.getByRole("img", { name: "Test User" })).toHaveAttribute(
            "src",
            "https://example.com/avatar.png"
        );
        expect(
            screen.getByRole("button", { name: "Sign Out" })
        ).toBeInTheDocument();
    });
});
