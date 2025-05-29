import { screen } from "@testing-library/react";
import Header from "../components/Header";
import { renderWithContext } from "../test-helpers";

describe("Header", () => {
    it("renders the header with user information", () => {
        renderWithContext(<Header />);

        expect(screen.getByRole("img", { name: "Logo" }));
        expect(
            screen.getByRole("heading", { level: 1, name: "App" })
        ).toBeInTheDocument();
    });
});
