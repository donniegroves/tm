import { forgotPasswordAction } from "@/app/actions";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

jest.mock("@/app/actions");

test("renders Forgot Password form", () => {
    render(<ForgotPasswordForm />);
    const linkElement = screen.getByText(/Forgot Password/i);
    expect(linkElement).toBeInTheDocument();
});

test("calls forgotPasswordAction on submit with correct email", async () => {
    const mockFn = forgotPasswordAction as jest.Mock;
    mockFn.mockResolvedValueOnce({ success: true });

    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, {
        target: { value: "email@example.test" },
    });
    const submitButton = screen.getByRole("button", {
        name: /Reset Password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("email@example.test");
    });
});

test("calls forgotPasswordAction on submit and sets error state when action fails", async () => {
    const mockFn = forgotPasswordAction as jest.Mock;
    mockFn.mockRejectedValueOnce(new Error("Network error"));

    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, {
        target: { value: "email@example.test" },
    });
    const submitButton = screen.getByRole("button", {
        name: /Reset Password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
        const errorMessage = screen.getByText(
            /An error occurred while sending the password reset email./i
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
