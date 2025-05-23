"use client";

import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Strings } from "app/common-strings";
import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import { signIn } from "../actions/signIn";
import HorizontalRule from "./HorizontalRule";

export function LoginPageContent() {
    const [error, setError] = useState<string | null | ReactNode>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        try {
            await signIn(email, password);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "invalid_credentials"
            ) {
                setError(
                    <>
                        Email or password was incorrect. Please try again or{" "}
                        <Link className="underline" href="/forgot-password">
                            reset your password
                        </Link>
                        .
                    </>
                );
            } else {
                setError(Strings.GENERIC);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-4xl font-bold mb-10">Login</h1>
            <HorizontalRule text="Login with a third-party account" />
            <div className="flex justify-center">
                <GoogleSignInButton mode="signin" setError={setError} />
            </div>
            <HorizontalRule text="or" />
            <Form onSubmit={handleLogin}>
                <Input
                    label="Email"
                    name="email"
                    placeholder={Strings.EMAIL_PLACEHOLDER}
                    type="email"
                    autoComplete="email"
                    required
                />
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Submit"}
                </Button>
                {error && <p className="text-red-500 text-left">{error}</p>}
                <HorizontalRule />
                <Link className="underline" href="/forgot-password">
                    Forgot Password?
                </Link>
                <div>
                    No account? Signup{" "}
                    <Link className="underline" href="/signup">
                        here
                    </Link>
                    .
                </div>
            </Form>
        </>
    );
}
