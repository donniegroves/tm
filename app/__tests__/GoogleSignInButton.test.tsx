import { signInWithIdTokenAction } from "@/app/actions";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { render, waitFor } from "@testing-library/react";

jest.mock("@/app/actions");

describe("GoogleSignInButton", () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID = "test-client-id";
    });

    it("renders null if NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID is not set", async () => {
        delete process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

        const { container } = render(
            <GoogleSignInButton mode="signin" setError={jest.fn()} />
        );

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it("renders the Google Sign-In button when all conditions are met", async () => {
        const { container } = render(
            <GoogleSignInButton mode="signin" setError={jest.fn()} />
        );

        await waitFor(() => {
            expect(container.firstChild).not.toBeNull();
            expect(container.querySelector("#g_id_onload")).toBeInTheDocument();
            expect(container.querySelector(".g_id_signin")).toBeInTheDocument();
        });
    });

    it("running window.handleSignInWithGoogle calls signInWithIdTokenAction", async () => {
        const setErrorMock = jest.fn();
        const mockFn = signInWithIdTokenAction as jest.Mock;
        mockFn.mockResolvedValue({});

        const { container } = render(
            <GoogleSignInButton mode="signin" setError={setErrorMock} />
        );

        await waitFor(() => {
            expect(container.firstChild).not.toBeNull();
        });

        window.handleSignInWithGoogle({
            credential: "test-credential",
        });

        await waitFor(() => {
            expect(setErrorMock).not.toHaveBeenCalled();
        });
    });

    it("running window.handleSignInWithGoogle sets the error state when signInWithIdTokenAction fails", async () => {
        const setErrorMock = jest.fn();
        const mockFn = signInWithIdTokenAction as jest.Mock;
        mockFn.mockRejectedValue(new Error());

        const { container } = render(
            <GoogleSignInButton mode="signin" setError={setErrorMock} />
        );

        await waitFor(() => {
            expect(container.firstChild).not.toBeNull();
        });

        window.handleSignInWithGoogle({
            credential: "test-credential",
        });

        await waitFor(() => {
            expect(setErrorMock).toHaveBeenCalledTimes(1);
        });
    });
});
