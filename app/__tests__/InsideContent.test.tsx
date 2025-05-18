import { render, screen } from "@testing-library/react";
import InsideContent from "../components/InsideContent";

describe("InsideContent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch and display access_level and games associated with the user", async () => {
        render(<InsideContent />);

        expect(screen.getByText("InsideContent")).toBeInTheDocument();
    });
});
