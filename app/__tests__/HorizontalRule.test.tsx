import { render, screen } from "@testing-library/react";
import HorizontalRule from "../components/HorizontalRule";

describe("HorizontalRule", () => {
    it("renders a horizontal rule without text", () => {
        render(<HorizontalRule />);

        const hrElement = screen.getByRole("separator");
        expect(hrElement).toBeInTheDocument();
        expect(hrElement).toHaveClass("w-full my-6 border-gray-300");
    });

    it("renders a horizontal rule with text", () => {
        const testText = "Test Text";
        render(<HorizontalRule text={testText} />);

        const textElement = screen.getByText(testText);
        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveClass("px-2 text-gray-500");

        const hrElements = screen.getAllByRole("separator");
        expect(hrElements).toHaveLength(2);
        hrElements.forEach((hr) => {
            expect(hr).toHaveClass("flex-grow border-gray-300");
        });
    });
});
