import { fireEvent, render, screen } from "@testing-library/react";
import { signOut } from "../actions/signOut";
import SignOutButton from "../components/SignOutButton";

jest.mock("../actions/signOut", () => ({
    signOut: jest.fn(),
}));

describe("SignOutButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the button with the correct text", () => {
        render(<SignOutButton />);

        const button = screen.getByRole("button", { name: /sign out/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Sign Out");
    });

    it("shows a spinner and disables the button while signing out", async () => {
        (signOut as jest.Mock).mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 1000))
        );

        render(<SignOutButton />);

        const button = screen.getByRole("button", { name: /sign out/i });
        fireEvent.click(button);

        expect(button).toBeDisabled();
        expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

        await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: remove this unnecessary wait

        expect(button).not.toBeDisabled();
        expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument();
    });

    it("calls the signOut action when clicked", async () => {
        render(<SignOutButton />);

        const button = screen.getByRole("button", { name: /sign out/i });
        fireEvent.click(button);

        expect(signOut).toHaveBeenCalledTimes(1);
    });
});
