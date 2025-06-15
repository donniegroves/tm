import { render, screen } from "@testing-library/react";
import GamesTable from "../components/GamesTable";
import DrawerProvider from "../inside/DrawerProvider";
import {
    mockUseInsideContext,
    setMockInsideContext,
} from "./helpers/helper-InsideContext";
import { mockAllUsers, mockPublicGameRow } from "./helpers/helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));
beforeEach(() => {
    setMockInsideContext();
});

describe("GamesTable", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("renders games in the table", () => {
        render(
            <DrawerProvider>
                <GamesTable />
            </DrawerProvider>
        );

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
        setMockInsideContext({
            games: [gameWithNoBots],
        });
        render(
            <DrawerProvider>
                <GamesTable />
            </DrawerProvider>
        );

        expect(screen.getByRole("gridcell", { name: "0" })).toBeInTheDocument();
    });
    it("renders an add game button", () => {
        render(
            <DrawerProvider>
                <GamesTable />
            </DrawerProvider>
        );

        expect(
            screen.getByRole("button", { name: "Add game" })
        ).toBeInTheDocument();
    });
});
