import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HeaderProfileButton from "../components/HeaderProfileButton";

jest.mock("../actions/signOut", () => ({
    signOut: jest.fn(),
}));

import { signOut } from "../actions/signOut";

describe("HeaderProfileButton", () => {
    it("renders the dropdown and menu items", async () => {
        render(<HeaderProfileButton />);
        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(screen.getByText("Profile")).toBeInTheDocument();
            expect(screen.getByText("Sign out")).toBeInTheDocument();
        });
    });

    it("calls signOut when 'Sign out' is clicked", async () => {
        render(<HeaderProfileButton />);
        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByText("Sign out"));

        await waitFor(() => {
            expect(signOut).toHaveBeenCalled();
        });
    });
});
