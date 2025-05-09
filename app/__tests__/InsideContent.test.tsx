import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Database } from "database.types";
import { createClient } from "../../utils/supabase/server";
import { signOut } from "../actions/signOut";
import { AccessLevel } from "../common";
import InsideContent from "../components/InsideContent";

jest.mock("../../utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

jest.mock("../actions/signOut", () => ({
    signOut: jest.fn(),
}));

const mockUser: Database["public"]["Tables"]["users"]["Row"] | null = {
    user_id: "fake-user-id",
    access_level: AccessLevel.USER,
    created_at: "2025-04-26T12:00:00.000Z",
    updated_at: null,
};

describe("InsideContent", () => {
    it("should fetch and display access_level and games associated with the user", async () => {
        const mockGames = [
            {
                id: 1,
                host_user_id: mockUser.user_id,
                share_code: "ABC123",
                num_static_ai: 2,
                seconds_per_pre: 60,
                seconds_per_rank: 120,
                created_at: "2025-04-26T12:00:00.000Z",
                updated_at: null,
            },
        ];

        const mockFrom = jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn(() => ({
                        data: mockGames,
                        error: null,
                    })),
                })),
            })),
        }));

        (createClient as jest.Mock).mockReturnValue({
            from: mockFrom,
        });

        render(<InsideContent user={mockUser} games={mockGames} />);

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { name: "Games" })
            ).toBeInTheDocument();
        });

        expect(screen.getByText("user_id: fake-user-id")).toBeInTheDocument();
        expect(screen.getByText("access_level: 0")).toBeInTheDocument();
        expect(screen.getByText("id: 1")).toBeInTheDocument();
        expect(
            screen.getByText("host_user_id: fake-user-id")
        ).toBeInTheDocument();
        expect(screen.getByText("share_code: ABC123")).toBeInTheDocument();
        expect(screen.getByText("num_static_ai: 2")).toBeInTheDocument();
        expect(screen.getByText("seconds_per_pre: 60")).toBeInTheDocument();
        expect(screen.getByText("seconds_per_rank: 120")).toBeInTheDocument();
        expect(
            screen.getByText("created_at: 2025-04-26T12:00:00.000Z")
        ).toBeInTheDocument();
        screen.getByText("updated_at:");
    });

    it("should call signOut when clicking on the 'Sign out' button", async () => {
        render(<InsideContent user={mockUser} games={[]} />);

        await waitFor(() => {
            const signOutButton = screen.getByText("Sign out");
            fireEvent.click(signOutButton);
        });

        expect(signOut).toHaveBeenCalled();
    });
});
