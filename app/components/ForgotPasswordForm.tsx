"use client";

import { Strings } from "@/app/common";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { FormEvent, useState } from "react";
import { forgotPassword } from "../actions/forgotPassword";

export default function ForgotPasswordForm() {
    const [status, setStatus] = useState<{
        type: "error" | "success";
        message: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPasswordSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email")?.toString();
        if (email) {
            try {
                await forgotPassword(email);
                setStatus({
                    type: "success",
                    message: Strings.PW_RESET_SENT,
                });
            } catch {
                setStatus({
                    type: "error",
                    message:
                        "An error occurred while sending the password reset email.",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Form onSubmit={handleForgotPasswordSubmit}>
            <h1 className="text-4xl self-center font-bold">Forgot Password</h1>
            <p className="my-4">
                Input your email below, and if that email exists in our records,
                you will be sent a password-reset email.
            </p>
            <Input
                label="Email"
                name="email"
                placeholder={Strings.EMAIL_PLACEHOLDER}
                type="email"
                autoComplete="email"
                required
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Reset Password"}
            </Button>
            {status && (
                <p
                    className={
                        status.type === "error"
                            ? "text-red-500"
                            : "text-green-500"
                    }
                >
                    {status.message}
                </p>
            )}
        </Form>
    );
}
