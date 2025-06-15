import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import AddGameForm, {
    getAvatarUrlFromUser,
    getFullNameStringFromUser,
    getUserFromAllUsers,
} from "../components/AddGameForm";
import { mockAllUsers } from "./helpers/helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({ allUsers: mockAllUsers }),
}));

describe("AddGameForm", () => {
    it("renders all main fields and allows host selection and share code entry", () => {
        render(<AddGameForm />);
        expect(screen.getByLabelText(/host/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Share Code")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /number of ai bots/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /seconds per question/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /seconds per ranking/i })
        ).toBeInTheDocument();
    });

    it("updates share code input when typing and clicking generate", async () => {
        render(<AddGameForm />);
        const input = screen.getByLabelText("Share Code");
        fireEvent.change(input, { target: { value: "abc123" } });
        expect(input).toHaveValue("ABC");

        const button = screen.getByRole("button", {
            name: "Generate Share Code",
        });
        act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect((input as HTMLInputElement).value).toMatch(
                /^[ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/
            );
        });
    });

    it("updates AI bots, seconds per question, and seconds per ranking selects", async () => {
        render(<AddGameForm />);
        const aiBotsSelect = screen.getByRole("button", {
            name: /number of ai bots/i,
        });
        fireEvent.click(aiBotsSelect);

        await waitFor(() => {
            screen.getByRole("option", { name: "2" });
        });

        const option2 = screen.getByRole("option", { name: "2" });
        fireEvent.click(option2);

        await waitFor(() => {
            screen.getByRole("button", {
                name: /seconds per question/i,
            });
        });

        const questionSelect = screen.getByRole("button", {
            name: /seconds per question/i,
        });
        fireEvent.click(questionSelect);

        await waitFor(() => {
            screen.getByRole("option", { name: "60" });
        });

        const option60 = screen.getByRole("option", { name: "60" });
        fireEvent.click(option60);

        await waitFor(() => {
            screen.getByRole("button", {
                name: /seconds per ranking/i,
            });
        });

        const rankingSelect = screen.getByRole("button", {
            name: /seconds per ranking/i,
        });
        fireEvent.click(rankingSelect);

        await waitFor(() => {
            screen.getByRole("option", { name: "90" });
        });
        const option90 = screen.getByRole("option", { name: "90" });
        fireEvent.click(option90);

        expect(aiBotsSelect).toHaveTextContent("2");
        expect(questionSelect).toHaveTextContent("60");
        expect(rankingSelect).toHaveTextContent("90");
    });

    it("renders avatars in the host autocomplete options", async () => {
        render(<AddGameForm />);

        act(() => {
            fireEvent.click(
                screen.getAllByRole("button", { name: "Show suggestions" })[0]
            );
        });

        await waitFor(() => {
            expect(screen.getAllByRole("img")).toHaveLength(
                mockAllUsers.length
            );
        });

        mockAllUsers.forEach((user) => {
            if (user.full_name && user.avatar_url) {
                expect(screen.getByText(user.full_name)).toBeInTheDocument();
                expect(screen.getByAltText(user.full_name)).toHaveAttribute(
                    "src",
                    user.avatar_url
                );
            }
        });

        act(() => {
            fireEvent.click(
                screen.getByRole("option", {
                    name: "Test User 2 Test User 2 testuser2@example.com",
                })
            );
        });

        expect(screen.getAllByRole("img")).toHaveLength(1);
        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            "https://example.com/avatar2.png"
        );
    });
});

describe("getUserFromAllUsers", () => {
    it("finds by user_id", () => {
        const result = getUserFromAllUsers({ user_id: "user2" }, mockAllUsers);
        expect(result).toEqual(mockAllUsers[1]);
    });

    it("finds by email", () => {
        const result = getUserFromAllUsers(
            { email: "testuser1@example.com" },
            mockAllUsers
        );
        expect(result).toEqual(mockAllUsers[0]);
    });

    it("finds by username", () => {
        const result = getUserFromAllUsers(
            { username: "testuser2" },
            mockAllUsers
        );
        expect(result).toEqual(mockAllUsers[1]);
    });

    it("returns undefined if not found", () => {
        const result = getUserFromAllUsers(
            { user_id: "notfound" },
            mockAllUsers
        );
        expect(result).toBeUndefined();
    });
});

describe("getFullNameStringFromUser", () => {
    it("returns the full_name if user is defined", () => {
        const user = { ...mockAllUsers[0], full_name: "Test User" };
        const result = getFullNameStringFromUser(user);
        expect(result).toBe("Test User");
    });
    it("returns undefined if user is undefined", () => {
        const result = getFullNameStringFromUser(undefined);
        expect(result).toBeUndefined();
    });
});

describe("getAvatarUrlFromUser", () => {
    it("returns the avatar_url if user is defined", () => {
        const user = { ...mockAllUsers[0], avatar_url: "avatar.png" };
        const result = getAvatarUrlFromUser(user);
        expect(result).toBe("avatar.png");
    });
    it("returns undefined if user is undefined", () => {
        const result = getAvatarUrlFromUser(undefined);
        expect(result).toBeUndefined();
    });
});
