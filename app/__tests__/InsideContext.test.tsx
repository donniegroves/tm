import { render, screen } from "@testing-library/react";
import {
    InsideContextProvider,
    useInsideContext,
} from "../inside/InsideContext";

describe("InsideContext", () => {
    const mockLoggedInUser = {
        id: "user1",
        access_level: 1,
        email: "user1@example.com",
        user_metadata: {},
        app_metadata: {},
        aud: "authenticated",
        created_at: "2025-05-01T00:00:00.000Z",
    };

    const mockOtherUsers = [
        {
            user_id: "user2",
            access_level: 2,
            created_at: "2025-05-01T00:00:00.000Z",
            updated_at: "2025-05-01T00:00:00.000Z",
        },
        {
            user_id: "user3",
            access_level: 3,
            created_at: "2025-05-01T00:00:00.000Z",
            updated_at: "2025-05-01T00:00:00.000Z",
        },
    ];

    const mockVisibleGames = [
        {
            id: 111,
            share_code: "ABC123",
            created_at: "2025-05-01T00:00:00.000Z",
            host_user_id: "user1",
            num_static_ai: 0,
            seconds_per_pre: 0,
            seconds_per_rank: 5,
            updated_at: "2025-05-01T00:00:00.000Z",
        },
        {
            id: 222,
            share_code: "XYZ789",
            created_at: "2025-05-01T00:00:00.000Z",
            host_user_id: "user2",
            num_static_ai: 0,
            seconds_per_pre: 0,
            seconds_per_rank: 5,
            updated_at: "2025-05-01T00:00:00.000Z",
        },
    ];

    const TestComponent = () => {
        const context = useInsideContext();
        return (
            <div>
                <p>Logged in user: {context.loggedInUser.id}</p>
                <p>Other users: {context.otherUsers.length}</p>
                <p>Visible games: {context.visibleGames.length}</p>
            </div>
        );
    };

    it("provides the correct context values", () => {
        render(
            <InsideContextProvider
                loggedInUser={mockLoggedInUser}
                otherUsers={mockOtherUsers}
                visibleGames={mockVisibleGames}
            >
                <TestComponent />
            </InsideContextProvider>
        );

        expect(screen.getByText(/Logged in user: user1/)).toBeInTheDocument();
        expect(screen.getByText(/Other users: 2/)).toBeInTheDocument();
        expect(screen.getByText(/Visible games: 2/)).toBeInTheDocument();
    });

    it("throws an error when used outside of the provider", () => {
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        expect(() => render(<TestComponent />)).toThrow(
            "useInsideContext must be used within a InsideContextProvider"
        );

        consoleError.mockRestore();
    });
});
