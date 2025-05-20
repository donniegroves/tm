import { render, screen } from "@testing-library/react";
import GamesTable from "../components/GamesTable";
import { mockAllUsers, mockPublicGameRow } from "../test-helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({
        gamesData: [
            mockPublicGameRow,
            {
                ...mockPublicGameRow,
                num_static_ai: null,
                share_code: "test923",
                host_user_id: "something_else",
                seconds_per_pre: 12,
                seconds_per_rank: 13,
            },
        ],
        allUsers: mockAllUsers,
    }),
}));

describe("GamesTable", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("renders games in the table", () => {
        render(<GamesTable />);

        expect(screen.getByRole("grid", { name: "Games" })).toBeInTheDocument();

        expect(
            screen.getByText(mockPublicGameRow.share_code)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockAllUsers[0].username ?? "garbage")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("img", {
                name: mockAllUsers[0].full_name ?? "garbage",
            })
        ).toHaveAttribute("src", mockAllUsers[0].avatar_url);
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
    it("shows 0 for missing AI bots", () => {
        const gameWithNoBots = { ...mockPublicGameRow, num_static_ai: null };
        jest.resetModules();
        jest.resetAllMocks();
        jest.mock("../inside/InsideContext", () => ({
            useInsideContext: () => ({
                gamesData: [gameWithNoBots],
                allUsers: mockAllUsers,
            }),
        }));
        render(<GamesTable />);

        expect(screen.getByRole("gridcell", { name: "0" })).toBeInTheDocument();
    });
});
