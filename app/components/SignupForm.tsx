"use client";

import { Strings } from "@/app/common";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signUp } from "../actions/signUp";
import HorizontalRule from "./HorizontalRule";

const validateFormData = (
    formData: FormData
):
    | {
          isValid: true;
          validEmail: string;
          validPassword: string;
          error: null;
      }
    | {
          isValid: false;
          validEmail?: undefined;
          validPassword?: undefined;
          error: string;
      } => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const c_password = formData.get("c_password")?.toString();

    if (!email || !password || !c_password) {
        return { isValid: false, error: Strings.EMAIL_PW_REQUIRED };
    }

    if (password !== c_password) {
        return { isValid: false, error: "Passwords do not match" };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        return {
            isValid: false,
            error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        };
    }

    return {
        isValid: true,
        error: null,
        validEmail: email,
        validPassword: password,
    };
};

export function SignupForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);
        const { isValid, error, validEmail, validPassword } =
            validateFormData(formData);

        if (!isValid) {
            setError(error);
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await signUp(validEmail, validPassword);
            if (!data || !data.user) {
                setError(Strings.GENERIC);
                setIsLoading(false);
                return;
            } else {
                router.push("/confirm-email?email=" + validEmail);
            }
        } catch (error) {
            if (
                error instanceof Error &&
                error.message == "user_already_exists"
            ) {
                setError(Strings.USER_EXISTS);
            } else {
                setError(Strings.GENERIC);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSignup}>
            <h1 className="text-4xl self-center font-bold mb-10">Signup</h1>
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
                placeholder="Enter a new password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
            />
            <Input
                label="Password Confirmation"
                placeholder="Confirm your new password"
                type="password"
                name="c_password"
                autoComplete="new-password"
                required
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Submit"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            <HorizontalRule />
            <div>
                Already have an account? Login{" "}
                <Link className="underline" href="/login">
                    here
                </Link>
                .
            </div>
        </Form>
    );
}
