import { Strings } from "@/app/common";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { signIn } from "../actions/signIn";
import { LoginForm } from "../components/LoginForm";

jest.mock("app/actions/signIn", () => ({
    signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@heroui/input", () => {
    const OriginalInput = jest.requireActual("@heroui/input").Input;
    return {
        Input: (props: React.ComponentProps<typeof OriginalInput>) => (
            <OriginalInput {...props} required={false} />
        ),
    };
});

describe("LoginForm", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    it("calls signInAction with email and password on valid form submission", async () => {
        (signIn as jest.Mock).mockResolvedValueOnce(undefined);

        render(<LoginForm />);

        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", {
            name: "Submit",
        });

        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "password123" },
        });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(signIn).toHaveBeenCalledWith(
                "test@example.com",
                "password123"
            );
        });
    });

    it("shows an error if signIn throws an invalid_credentials error", async () => {
        (signIn as jest.Mock).mockRejectedValueOnce(
            new Error("invalid_credentials")
        );

        render(<LoginForm />);

        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", {
            name: "Submit",
        });

        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "password123" },
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/Email or password was incorrect./)
            ).toBeInTheDocument();
        });
    });

    it("shows a generic error if signInAction throws an unknown error", async () => {
        (signIn as jest.Mock).mockRejectedValueOnce(new Error("unknown_error"));

        render(<LoginForm />);
        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", {
            name: "Submit",
        });
        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "password123" },
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(Strings.GENERIC)).toBeInTheDocument();
        });
    });

    it("redirects to /inside on successful login", async () => {
        (signIn as jest.Mock).mockResolvedValueOnce({
            data: { user: {} },
            error: null,
        });

        render(<LoginForm />);
        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", {
            name: "Submit",
        });
        fireEvent.change(emailInput, {
            target: { value: "test@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "password123" },
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/inside");
        });
    });

    it("does not call handleLogin if inputs are empty", async () => {
        render(<LoginForm />);

        const submitButton = screen.getByRole("button", {
            name: "Submit",
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(signIn).not.toHaveBeenCalled();
            expect(mockPush).not.toHaveBeenCalled();
            expect(
                screen.getByText("Please fill in all fields.")
            ).toBeInTheDocument();
        });
    });
});
