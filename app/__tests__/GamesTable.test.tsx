import { render, screen } from "@testing-library/react";
import GamesTable from "../components/GamesTable";
import { mockPublicGameRow } from "../test-helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({
        gamesData: [mockPublicGameRow],
    }),
}));

describe("GamesTable", () => {
    it("renders games in the table", () => {
        render(<GamesTable />);

        expect(screen.getByRole("grid", { name: "Games" })).toBeInTheDocument();

        expect(
            screen.getByText(mockPublicGameRow.share_code)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicGameRow.host_user_id ?? "garbage")
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicGameRow.num_static_ai ?? "garbage")
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicGameRow.seconds_per_pre)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicGameRow.seconds_per_rank)
        ).toBeInTheDocument();
    });
});
