import { Strings } from "@/app/common";
import { SignupForm } from "@/app/components/SignupForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signUp } from "../actions/signUp";

jest.mock("app/actions/signUp", () => ({
    signUp: jest.fn(),
}));

jest.mock("@heroui/input", () => {
    const OriginalInput = jest.requireActual("@heroui/input").Input;
    return {
        Input: (props: React.ComponentProps<typeof OriginalInput>) => (
            <OriginalInput {...props} required={false} />
        ),
    };
});

const emailLabel = "Email";
const passwordLabel = "Password";
const confirmPasswordLabel = "Password Confirmation";
const submitButtonLabel = "Submit";
const submitButtonLabelPending = "Signing up...";

const setup = (email = "", password = "", confirmPassword = "") => {
    render(<SignupForm />);
    if (email) {
        fireEvent.change(screen.getByLabelText(emailLabel), {
            target: { value: email },
        });
    }
    if (password) {
        fireEvent.change(screen.getByLabelText(passwordLabel), {
            target: { value: password },
        });
    }
    if (confirmPassword) {
        fireEvent.change(screen.getByLabelText(confirmPasswordLabel), {
            target: { value: confirmPassword },
        });
    }
    fireEvent.click(screen.getByRole("button", { name: submitButtonLabel }));
};

describe("SignupForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the signup form", () => {
        setup();
        expect(screen.getByLabelText(emailLabel)).toBeInTheDocument();
        expect(screen.getByLabelText(passwordLabel)).toBeInTheDocument();
        expect(screen.getByLabelText(confirmPasswordLabel)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: submitButtonLabel })
        ).toBeInTheDocument();
    });

    it("shows an error if email or password fields are empty", async () => {
        setup();
        await waitFor(() => {
            expect(
                screen.getByText(Strings.EMAIL_PW_REQUIRED)
            ).toBeInTheDocument();
        });
    });

    it("shows an error if passwords do not match", async () => {
        setup("test@example.com", "Password123", "Password456");
        await waitFor(() => {
            expect(
                screen.getByText("Passwords do not match")
            ).toBeInTheDocument();
        });
    });

    it("shows error when password is insecure", async () => {
        setup("test@example.com", "abc", "abc");
        await waitFor(() => {
            expect(
                screen.getByText(
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                )
            ).toBeInTheDocument();
        });
    });

    it("shows a loading state when the form is submitted", async () => {
        (signUp as jest.Mock).mockResolvedValueOnce(undefined);
        setup("test@example.com", "Password123", "Password123");
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: submitButtonLabelPending })
            ).toBeInTheDocument();
            expect(signUp).toHaveBeenCalledWith(
                "test@example.com",
                "Password123"
            );
        });
    });

    it("shows an error if signUp throws a user_already_exists error", async () => {
        (signUp as jest.Mock).mockRejectedValueOnce(
            new Error("user_already_exists")
        );
        setup("test@example.com", "Password123", "Password123");
        await waitFor(() => {
            expect(screen.getByText(Strings.USER_EXISTS)).toBeInTheDocument();
        });
    });

    it("shows a generic error if signUp throws an unknown error", async () => {
        (signUp as jest.Mock).mockRejectedValueOnce(new Error("unknown_error"));
        setup("test@example.com", "Password123", "Password123");
        await waitFor(() => {
            expect(screen.getByText(Strings.GENERIC)).toBeInTheDocument();
        });
    });
});
