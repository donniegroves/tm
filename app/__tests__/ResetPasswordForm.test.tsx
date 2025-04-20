import { resetPasswordAction } from "@/app/actions";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ResetPasswordForm from "../components/ResetPasswordForm";

jest.mock("@/app/actions");

describe("ResetPasswordForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders ResetPasswordForm with inputs and submit button", () => {
        render(<ResetPasswordForm />);

        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText(/Re-enter password/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Reset Password/i })
        ).toBeInTheDocument();
    });

    test("displays error when passwords do not match", async () => {
        render(<ResetPasswordForm />);

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "Password123" },
        });
        fireEvent.change(screen.getByLabelText(/Re-enter password/i), {
            target: { value: "Password456" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: /Reset Password/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Passwords do not match/i)
            ).toBeInTheDocument();
        });
    });

    test("weak passwords generate error", async () => {
        render(<ResetPasswordForm />);

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "123" },
        });
        fireEvent.change(screen.getByLabelText(/Re-enter password/i), {
            target: { value: "123" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: /Reset Password/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                )
            ).toBeInTheDocument();
        });
    });

    test("calls resetPasswordAction on valid form submission", async () => {
        const mockResetPasswordAction = resetPasswordAction as jest.Mock;
        mockResetPasswordAction.mockResolvedValueOnce(undefined);

        render(<ResetPasswordForm />);

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "Password123" },
        });
        fireEvent.change(screen.getByLabelText(/Re-enter password/i), {
            target: { value: "Password123" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: /Reset Password/i })
        );

        await waitFor(() => {
            expect(mockResetPasswordAction).toHaveBeenCalledTimes(1);
            expect(mockResetPasswordAction).toHaveBeenCalledWith("Password123");
        });
    });

    test("displays error when resetPasswordAction fails", async () => {
        const mockResetPasswordAction = resetPasswordAction as jest.Mock;
        mockResetPasswordAction.mockRejectedValueOnce(
            new Error("Network error")
        );

        render(<ResetPasswordForm />);

        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "Password123" },
        });
        fireEvent.change(screen.getByLabelText(/Re-enter password/i), {
            target: { value: "Password123" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: /Reset Password/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Failed to reset password/i)
            ).toBeInTheDocument();
        });
    });
});
