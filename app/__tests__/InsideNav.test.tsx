import { render, screen } from "@testing-library/react";
import InsideNav from "../components/InsideNav";
import DrawerProvider from "../inside/DrawerProvider";
import { mockUseInsideContext, setMockInsideContext } from "../test-helpers";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));
jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));

beforeEach(() => {
    setMockInsideContext();
});

describe("InsideNav", () => {
    it("renders all navigation menu items", () => {
        render(
            <DrawerProvider>
                <InsideNav />
            </DrawerProvider>
        );
        expect(screen.getByRole("navigation")).toBeInTheDocument();
        expect(screen.getByLabelText("Games")).toBeInTheDocument();
        expect(screen.getByLabelText("Users")).toBeInTheDocument();
        expect(screen.getByLabelText("Questions")).toBeInTheDocument();
        expect(screen.getByLabelText("Settings")).toBeInTheDocument();
    });
});
