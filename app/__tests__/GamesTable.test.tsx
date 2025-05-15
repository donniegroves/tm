import { render, screen } from "@testing-library/react";
import GamesTable from "../components/GamesTable";

const mockGames = [
    { id: 77778, share_code: "CODE99" },
    { id: 88888, share_code: "CODE88" },
];

describe("GamesTable", () => {
    it("renders games in the table", () => {
        render(<GamesTable games={mockGames} />);
        expect(screen.getByText("77778")).toBeInTheDocument();
        expect(screen.getByText("CODE99")).toBeInTheDocument();
        expect(screen.getByText("88888")).toBeInTheDocument();
        expect(screen.getByText("CODE88")).toBeInTheDocument();
        expect(screen.getByRole("grid", { name: "Games" })).toBeInTheDocument();
    });
});
