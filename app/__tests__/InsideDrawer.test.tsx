import { render, screen, waitFor } from "@testing-library/react";
import { InsideDrawer } from "../components/InsideDrawer";

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => ({
        drawerContent: {
            header: <div data-testid="drawer-header">Header Content</div>,
            body: <div data-testid="drawer-body">Body Content</div>,
            footer: <div data-testid="drawer-footer">Footer Content</div>,
        },
        isDrawerOpen: true,
        setIsDrawerOpen: jest.fn(),
    }),
}));

describe("InsideDrawer", () => {
    it("renders the drawer with header, body, and footer content when open", async () => {
        render(<InsideDrawer />);

        await waitFor(() => {
            expect(screen.getByTestId("drawer-header")).toHaveTextContent(
                "Header Content"
            );
            expect(screen.getByTestId("drawer-body")).toHaveTextContent(
                "Body Content"
            );
            expect(screen.getByTestId("drawer-footer")).toHaveTextContent(
                "Footer Content"
            );
        });
    });
});
