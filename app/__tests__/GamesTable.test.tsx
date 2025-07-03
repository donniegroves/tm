import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GamesTable from "../components/GamesTable";
import {
    mockUseInsideContext,
    setMockInsideContext,
} from "./helpers/helper-InsideContext";
import { mockAllUsers, mockPublicGameRow } from "./helpers/helpers";
import { mockUseDrawer } from "./helpers/helper-DrawerContext";

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => mockUseDrawer(),
}));
jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({
        getQueryState: jest.fn(() => ({
            fetchStatus: "idle",
        })),
    }),
}));

jest.mock("../hooks/useDeleteGame", () => ({
    useDeleteGame: () => ({
        variables: { gameId: 123 },
        mutate: jest.fn(),
    }),
}));

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
            screen.getByText(mockPublicGameRow.num_static_ai)
        ).toBeInTheDocument();
        expect(
            screen.getAllByText(mockPublicGameRow.seconds_per_pre)
        ).toHaveLength(3);
        expect(
            screen.getByText(mockPublicGameRow.seconds_per_rank)
        ).toBeInTheDocument();
    });
    it("renders an add game button", () => {
        render(<GamesTable />);

        expect(
            screen.getByRole("button", { name: "Add game" })
        ).toBeInTheDocument();
    });
    it("renders multiple delete game buttons", () => {
        render(<GamesTable />);

        expect(screen.getAllByRole("button", { name: "Delete" }).length).toBe(
            3
        );
    });
    it("renders multiple edit game buttons", () => {
        render(<GamesTable />);

        expect(screen.getAllByRole("button", { name: "Edit" }).length).toBe(3);
    });
    it("row is blurred when question is being deleted", async () => {
        render(<GamesTable />);
        const deleteButton = screen.getAllByText("Delete")[1];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const blurredRow = screen
                .getAllByRole("row")
                .find((row) => row.classList.contains("blur-xs"));
            expect(blurredRow).toBeInTheDocument();

            expect(blurredRow).toHaveAttribute("data-key", "222");
        });
    });
});
