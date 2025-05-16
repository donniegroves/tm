import { render } from "@testing-library/react";
import { DownArrowSvg, SignOutSvg, UserIcon } from "../components/IconSvg";

describe("IconSvg components", () => {
    it("renders DownArrowSvg with default props", () => {
        const { container } = render(<DownArrowSvg />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("viewBox", "0 0 25.93 25.93");
    });

    it("renders SignOutSvg with custom fill", () => {
        const { container } = render(<SignOutSvg fill="#123456" />);
        const path = container.querySelector("svg path");
        expect(path).toHaveAttribute("fill", "#123456");
    });

    it("renders UserIcon with custom size and className", () => {
        const { container } = render(
            <UserIcon size={32} className="test-class" />
        );
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("height", "32");
        expect(svg).toHaveAttribute("width", "32");
        expect(svg).toHaveClass("test-class");
    });

    it("renders UserIcon with no height or width set", () => {
        const { container } = render(<UserIcon />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("height", "24");
        expect(svg).toHaveAttribute("width", "24");
    });
});
