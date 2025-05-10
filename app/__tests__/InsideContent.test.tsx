import { User } from "@supabase/supabase-js";
import { render, screen } from "@testing-library/react";
import InsideContent from "../components/InsideContent";
import { useInsideContext } from "../inside/InsideContext";

jest.mock("../../utils/supabase/client", () => ({
    createClient: jest.fn(),
}));

jest.mock("../actions/signOut", () => ({
    signOut: jest.fn(),
}));

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: jest.fn(),
}));

const mockUser: (User & { access_level: number }) | null = {
    id: "fake-user-id",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    access_level: 5555,
    created_at: "2025-04-26T12:00:00.000Z",
    updated_at: "2025-04-26T12:00:00.000Z",
};
const mockOtherUsers = [
    { user_id: "userid222", access_level: 22225 },
    { user_id: "userid333", access_level: 22226 },
];
const mockVisibleGames = [
    {
        id: 77778,
        share_code: "CODE99",
    },
];

(useInsideContext as jest.Mock).mockReturnValue({
    loggedInUser: mockUser,
    otherUsers: mockOtherUsers,
    visibleGames: mockVisibleGames,
});

describe("InsideContent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch and display access_level and games associated with the user", async () => {
        render(<InsideContent />);

        expect(
            screen.getByRole("heading", { name: "Games" })
        ).toBeInTheDocument();
        expect(screen.getByText("fake-user-id")).toBeInTheDocument();
        expect(screen.getByText("5555")).toBeInTheDocument();
        expect(screen.getByText("userid222")).toBeInTheDocument();
        expect(screen.getByText("22225")).toBeInTheDocument();
        expect(screen.getByText("userid333")).toBeInTheDocument();
        expect(screen.getByText("22226")).toBeInTheDocument();
        expect(screen.getByText("77778")).toBeInTheDocument();
        expect(screen.getByText("CODE99")).toBeInTheDocument();
    });
});
