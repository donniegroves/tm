import { screen } from "@testing-library/react";
import InsideNav from "../components/InsideNav";
import { renderWithContext } from "../test-helpers";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("InsideNav", () => {
    it("renders all navigation menu items", () => {
        renderWithContext(<InsideNav />);
        expect(screen.getByRole("navigation")).toBeInTheDocument();
        expect(screen.getByLabelText("Games")).toBeInTheDocument();
        expect(screen.getByLabelText("Users")).toBeInTheDocument();
        expect(screen.getByLabelText("Questions")).toBeInTheDocument();
        expect(screen.getByLabelText("Settings")).toBeInTheDocument();
    });
});
