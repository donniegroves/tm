import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import DrawerProvider from "../inside/DrawerProvider";
import {
    mockUseInsideContext,
    setMockInsideContext,
} from "./helpers/helper-InsideContext";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));
beforeEach(() => {
    setMockInsideContext();
});

describe("Header", () => {
    it("renders the header with user information", () => {
        process.env.NEXT_PUBLIC_APP_NAME = "MyTestApp";
        render(
            <DrawerProvider>
                <Header />
            </DrawerProvider>
        );

        expect(screen.getByRole("img", { name: "Logo" }));
        expect(
            screen.getByRole("heading", { level: 1, name: "MyTestApp" })
        ).toBeInTheDocument();
    });
});
