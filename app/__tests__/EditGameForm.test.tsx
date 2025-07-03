import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditGameForm from "../components/EditGameForm";
import {
    mockAllUsers,
    mockGamesData,
    mockGameUsersData,
} from "./helpers/helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({
        allUsers: mockAllUsers,
        games: mockGamesData,
        gameUsers: mockGameUsersData,
    }),
}));

describe("EditGameForm", () => {
    it("renders loading state initially", () => {
        const { container } = render(<EditGameForm gameId={-1} />);
        expect(container).toHaveTextContent("Game not found.");
    });

    it("renders form with current game details", () => {
        const { container } = render(<EditGameForm gameId={222} />);

        const gameIdHiddenInput = container.querySelector("#game-id-input");
        expect(gameIdHiddenInput).toBeInTheDocument();
        expect(gameIdHiddenInput).toHaveAttribute("type", "hidden");
        expect(gameIdHiddenInput).toHaveValue("222");

        const hostHiddenInput = container.querySelector("#host-input");
        expect(hostHiddenInput).toBeInTheDocument();
        expect(hostHiddenInput).toHaveAttribute("type", "hidden");
        expect(hostHiddenInput).toHaveValue("user2");

        const inviteesInput = container.querySelector("#invitees-input");
        expect(inviteesInput).toBeInTheDocument();
        expect(inviteesInput).toHaveAttribute("type", "hidden");
        expect(inviteesInput).toHaveValue("user3");

        const shareCodeInput = container.querySelector("#share-code-input");
        expect(shareCodeInput).toBeInTheDocument();
        expect(shareCodeInput).toHaveAttribute("type", "hidden");
        expect(shareCodeInput).toHaveValue("XYZXYZ");

        const aiBotsInput = container.querySelector("#ai-bots-input");
        expect(aiBotsInput).toBeInTheDocument();
        expect(aiBotsInput).toHaveAttribute("type", "hidden");
        expect(aiBotsInput).toHaveValue("3");

        const questionDurationInput = container.querySelector(
            "#question-duration-input"
        );
        expect(questionDurationInput).toBeInTheDocument();
        expect(questionDurationInput).toHaveAttribute("type", "hidden");
        expect(questionDurationInput).toHaveValue("90");

        const rankingDurationInput = container.querySelector(
            "#ranking-duration-input"
        );
        expect(rankingDurationInput).toBeInTheDocument();
        expect(rankingDurationInput).toHaveAttribute("type", "hidden");
        expect(rankingDurationInput).toHaveValue("90");
    });

    it("renders form with nullish game details", () => {
        const { container } = render(<EditGameForm gameId={333} />);

        const gameIdHiddenInput = container.querySelector("#game-id-input");
        expect(gameIdHiddenInput).toBeInTheDocument();
        expect(gameIdHiddenInput).toHaveAttribute("type", "hidden");
        expect(gameIdHiddenInput).toHaveValue("333");

        const hostHiddenInput = container.querySelector("#host-input");
        expect(hostHiddenInput).toBeInTheDocument();
        expect(hostHiddenInput).toHaveAttribute("type", "hidden");
        expect(hostHiddenInput).toHaveValue("");

        const inviteesInput = container.querySelector("#invitees-input");
        expect(inviteesInput).toBeInTheDocument();
        expect(inviteesInput).toHaveAttribute("type", "hidden");
        expect(inviteesInput).toHaveValue("");

        const shareCodeInput = container.querySelector("#share-code-input");
        expect(shareCodeInput).toBeInTheDocument();
        expect(shareCodeInput).toHaveAttribute("type", "hidden");
        expect(shareCodeInput).toHaveValue("ABCABC");

        const aiBotsInput = container.querySelector("#ai-bots-input");
        expect(aiBotsInput).toBeInTheDocument();
        expect(aiBotsInput).toHaveAttribute("type", "hidden");
        expect(aiBotsInput).toHaveValue("2");

        const questionDurationInput = container.querySelector(
            "#question-duration-input"
        );
        expect(questionDurationInput).toBeInTheDocument();
        expect(questionDurationInput).toHaveAttribute("type", "hidden");
        expect(questionDurationInput).toHaveValue("30");

        const rankingDurationInput = container.querySelector(
            "#ranking-duration-input"
        );
        expect(rankingDurationInput).toBeInTheDocument();
        expect(rankingDurationInput).toHaveAttribute("type", "hidden");
        expect(rankingDurationInput).toHaveValue("30");
    });

    it("updates host hidden input when host is changed", async () => {
        const { container } = render(<EditGameForm gameId={222} />);
        const hostDropdownButton = screen.getByLabelText(
            "Host dropdown button"
        );
        fireEvent.click(hostDropdownButton);
        fireEvent.click(
            screen.getByRole("option", {
                name: "Test User 3 Test User 3 testuser3@example.com",
            })
        );
        await waitFor(() => {
            const hostHiddenInput = container.querySelector("#host-input");
            expect(hostHiddenInput).toHaveValue("user3");
        });
    });

    it("updates invitees hidden input when invitees are changed", async () => {
        const { container } = render(<EditGameForm gameId={222} />);
        const inviteesDropdownButton = screen.getByRole("button", {
            name: "Invitee: Test User 3",
        });
        fireEvent.click(inviteesDropdownButton);
        fireEvent.click(
            screen.getByRole("option", {
                name: "Test User 2 Test User 2 testuser2@example.com",
            })
        );
        await waitFor(() => {
            const inviteesHiddenInput =
                container.querySelector("#invitees-input");
            expect(inviteesHiddenInput).toHaveValue("user3,user2");
        });
        fireEvent.click(
            screen.getByRole("option", {
                name: "testuser4@example.com",
            })
        );
    });

    it("updates share code hidden input when share code is changed", async () => {
        const { container } = render(<EditGameForm gameId={222} />);
        const shareCodeInput = container.querySelector(
            "#edit-game-share-code-input"
        );
        if (!shareCodeInput) {
            throw new Error("Share code input not found");
        }
        fireEvent.change(shareCodeInput, { target: { value: "ABCDEF" } });
        await waitFor(() => {
            expect(container.querySelector("#share-code-input")).toHaveValue(
                "ABCDEF"
            );
        });
    });

    it("updates AI bots hidden input when AI bots is changed", async () => {
        const { container } = render(<EditGameForm gameId={222} />);
        const botsDropdown = screen.getAllByLabelText("Number of AI Bots")[1];
        fireEvent.click(botsDropdown);
        fireEvent.click(screen.getByRole("option", { name: "2" }));
        await waitFor(() => {
            const aiBotsHiddenInput = container.querySelector("#ai-bots-input");
            expect(aiBotsHiddenInput).toHaveValue("2");
        });
    });

    it("updates question duration hidden input when question duration is changed", async () => {
        const { container } = render(<EditGameForm gameId={222} />);
        const questionSecondsDropdown = screen.getAllByLabelText(
            "Seconds per question"
        )[1];
        fireEvent.click(questionSecondsDropdown);
        fireEvent.click(screen.getByRole("option", { name: "30" }));
        await waitFor(() => {
            const questionDurationHiddenInput = container.querySelector(
                "#question-duration-input"
            );
            expect(questionDurationHiddenInput).toHaveValue("30");
        });
    });

    it("updates ranking duration hidden input when ranking duration is changed", async () => {
        const { container } = render(<EditGameForm gameId={222} />);
        const rankingSecondsDropdown = screen.getAllByLabelText(
            "Seconds per ranking"
        )[1];
        fireEvent.click(rankingSecondsDropdown);
        fireEvent.click(screen.getByRole("option", { name: "30" }));
        await waitFor(() => {
            const rankingDurationHiddenInput = container.querySelector(
                "#ranking-duration-input"
            );
            expect(rankingDurationHiddenInput).toHaveValue("30");
        });
    });
});
