"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { FormEvent, useState } from "react";
import { resetPassword } from "../actions/resetPassword";

const validateFormData = (
    formData: FormData
): { validPassword: string | false; error: string | null } => {
    const passwordInput = formData.get("password")?.toString();
    const c_passwordInput = formData.get("c_password")?.toString();

    if (passwordInput !== c_passwordInput) {
        return { validPassword: false, error: "Passwords do not match" };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordInput || !passwordRegex.test(passwordInput)) {
        return {
            validPassword: false,
            error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        };
    }

    return { validPassword: passwordInput, error: null };
};

export default function ResetPasswordForm() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPasswordSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        try {
            event.preventDefault();
            setIsLoading(true);
            const formData = new FormData(event.target as HTMLFormElement);

            const { validPassword, error } = validateFormData(formData);
            if (!validPassword) {
                setError(error);
                setIsLoading(false);
                return;
            }

            await resetPassword(validPassword);
        } catch {
            setError("Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleResetPasswordSubmit}>
            <Input
                label="Password"
                placeholder="Enter your new password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
            />
            <Input
                label="Re-enter password"
                placeholder="Re-enter your new password"
                type="password"
                name="c_password"
                autoComplete="new-password"
                required
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
            </Button>{" "}
            {error && <p className="text-red-500">{error}</p>}
        </Form>
    );
}
