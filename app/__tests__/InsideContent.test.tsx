import { User } from "@supabase/supabase-js";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { insertQuestion } from "../actions/insertQuestion";
import InsideContent from "../components/InsideContent";
import { useInsideContext } from "../inside/InsideContext";

jest.mock("../../utils/supabase/client", () => ({
    createClient: jest.fn(),
}));
jest.mock("../../utils/supabase/server", () => ({
    createClient: jest.fn(),
}));
jest.mock("../actions/signOut", () => ({
    signOut: jest.fn(),
}));
jest.mock("../inside/InsideContext", () => ({
    useInsideContext: jest.fn(),
}));
jest.mock("../actions/insertQuestion", () => ({
    insertQuestion: jest.fn(),
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
const mockQuestions = [
    { id: 765, pre_question: "What is your name?", rank_prompt: "Rank 1" },
    { id: 456, pre_question: "What is your quest?", rank_prompt: "Rank 2" },
];

(useInsideContext as jest.Mock).mockReturnValue({
    loggedInUser: mockUser,
    otherUsers: mockOtherUsers,
    visibleGames: mockVisibleGames,
    questions: mockQuestions,
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
        expect(screen.getByText("What is your name?")).toBeInTheDocument();
        expect(screen.getByText("What is your quest?")).toBeInTheDocument();
        expect(screen.getByText("Rank 1")).toBeInTheDocument();
        expect(screen.getByText("Rank 2")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Add random question" })
        ).toBeInTheDocument();

        const insertButton = screen.getByText("Add random question");

        fireEvent.click(insertButton);

        await waitFor(() => {
            expect(insertQuestion).toHaveBeenCalledTimes(1);
        });
    });
});
