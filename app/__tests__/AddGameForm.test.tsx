import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import AddGameForm from "../components/AddGameForm";
import { mockAllUsers } from "./helpers/helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({
        allUsers: [
            ...mockAllUsers,
            {
                user_id: "user3",
                username: "testuser3",
                full_name: null,
                email: "testuser3@example.com",
                access_level: 2,
                avatar_url: null,
                timezone: "America/New_York",
                created_at: "2024-06-01T12:00:00Z",
                updated_at: "2024-06-01T12:00:00Z",
            },
        ],
    }),
}));

describe("AddGameForm", () => {
    it("renders all main fields and allows host selection and share code entry", () => {
        render(<AddGameForm />);
        expect(screen.getByLabelText("Host")).toBeInTheDocument();
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
        const hostDropdownButton = screen.getByLabelText(
            "Host dropdown button"
        );

        act(() => {
            fireEvent.click(hostDropdownButton);
        });

        await waitFor(() => {
            expect(screen.getAllByRole("img")).toHaveLength(
                mockAllUsers.length + 1
            );
        });

        mockAllUsers.forEach((user) => {
            if (user.full_name && user.avatar_url) {
                const avatarImages = screen.getAllByRole("img", {
                    name: user.full_name,
                });
                expect(avatarImages).toHaveLength(1);
                expect(avatarImages[0]).toHaveAttribute("src", user.avatar_url);
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

    it("renders avatars in the invitee autocomplete options", async () => {
        render(<AddGameForm />);
        const inviteeDropdownButton = screen.getByRole("button", {
            name: "Select a user Invitees",
        });

        act(() => {
            fireEvent.click(inviteeDropdownButton);
        });

        await waitFor(() => {
            expect(screen.getAllByRole("img")).toHaveLength(
                mockAllUsers.length + 1
            );
        });

        mockAllUsers.forEach((user) => {
            if (user.full_name && user.avatar_url) {
                const avatarImages = screen.getAllByRole("img", {
                    name: user.full_name,
                });
                expect(avatarImages).toHaveLength(1);
                expect(avatarImages[0]).toHaveAttribute("src", user.avatar_url);
            }
        });

        act(() => {
            fireEvent.click(
                screen.getByRole("option", {
                    name: "testuser3@example.com",
                })
            );
        });

        // selected user has no full_name or avatar_url, so Chip shows "Invitee:"
        expect(screen.getByLabelText("Invitee:")).toBeInTheDocument();
    });
});
