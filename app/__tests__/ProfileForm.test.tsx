import { screen } from "@testing-library/react";
import ProfileForm from "../components/ProfileForm";
import { mockPublicUserRow, renderWithContext } from "../test-helpers";

describe("ProfileForm", () => {
    it("renders username input with user value", () => {
        renderWithContext(<ProfileForm />);
        const input = screen.getByLabelText(/username/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue("testuser");
    });

    it("renders timezone select with user timezone selected", () => {
        renderWithContext(<ProfileForm />, {
            allUsers: [{ ...mockPublicUserRow, timezone: "Asia/Tokyo" }],
        });
        const select = screen.getByRole("button", {
            name: /preferred timezone/i,
        });
        expect(select).toBeInTheDocument();
        const option = screen.getByRole("button", {
            name: "Japan (Tokyo) Preferred timezone",
        });
        expect(option).toBeInTheDocument();
    });

    it("renders all timezone options", () => {
        renderWithContext(<ProfileForm />);
        expect(screen.getByText("US Outlying Islands")).toBeInTheDocument();
        expect(screen.getByText("New Zealand (Auckland)")).toBeInTheDocument();
    });

    it("renders with empty values if user data is missing", () => {
        renderWithContext(<ProfileForm />, {
            loggedInUserId: "notfound",
            allUsers: [],
        });
        expect(screen.getByLabelText(/username/i)).toHaveValue("");

        const option = screen.getByRole("button", {
            name: "Preferred timezone",
        });
        expect(option).toBeInTheDocument();
    });
});
