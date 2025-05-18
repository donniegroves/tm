import { act, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NavMenuItem from "../components/NavMenuItem";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("NavMenuItem", () => {
    it("renders label and icon", () => {
        render(
            <NavMenuItem
                label="Test"
                icon={<span data-testid="icon">I</span>}
                href="/test"
            />
        );
        expect(screen.getByLabelText("Test")).toBeInTheDocument();
        expect(screen.getByText("Test")).toBeInTheDocument();
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("calls router.push on click", async () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push });
        render(<NavMenuItem label="Test" icon={<span />} href="/test" />);
        const button = screen.getByLabelText("Test");
        act(() => {
            button.click();
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith("/test");
        });
    });
});
