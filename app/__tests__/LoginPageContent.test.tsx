import { LoginPageContent } from "@/components/LoginPageContent";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signInAction } from "app/actions";
import { Strings } from "app/common-strings";

jest.mock("app/actions", () => ({
    signInAction: jest.fn(),
}));

jest.mock("@heroui/input", () => {
    const OriginalInput = jest.requireActual("@heroui/input").Input;
    return {
        Input: (props: React.ComponentProps<typeof OriginalInput>) => (
            <OriginalInput {...props} required={false} />
        ),
    };
});

describe("LoginPageContent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the login form", async () => {
        render(<LoginPageContent />);
        await waitFor(() => {
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Submit" })
            ).toBeInTheDocument();
        });
    });

    it("calls signInAction with email and password on valid form submission", async () => {
        (signInAction as jest.Mock).mockResolvedValueOnce(undefined);

        render(<LoginPageContent />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(signInAction).toHaveBeenCalledWith(
                "test@example.com",
                "password123"
            );
        });
    });

    it("shows an error if signInAction throws an invalid_credentials error", async () => {
        (signInAction as jest.Mock).mockRejectedValueOnce(
            new Error("invalid_credentials")
        );

        render(<LoginPageContent />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/Email or password was incorrect./)
            ).toBeInTheDocument();
        });
    });

    it("shows a generic error if signInAction throws an unknown error", async () => {
        (signInAction as jest.Mock).mockRejectedValueOnce(
            new Error("unknown_error")
        );

        render(<LoginPageContent />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText(Strings.GENERIC)).toBeInTheDocument();
        });
    });
});
