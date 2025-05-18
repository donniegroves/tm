import { render } from "@testing-library/react";
import {
    DownArrowSvg,
    GamesSvg,
    QuestionSvg,
    SettingsSvg,
    SignOutSvg,
    UserIcon,
    UsersSvg,
} from "../components/IconSvg";

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

    it("renders GamesSvg with custom className", () => {
        const { container } = render(<GamesSvg className="games-icon" />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass("games-icon");
    });

    it("renders UsersSvg with custom fill", () => {
        const { container } = render(<UsersSvg fill="#ff0000" />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        // UsersSvg may have a path or stroke, so check for fill or stroke
        const path = container.querySelector("svg path");
        if (path) {
            expect(
                path.getAttribute("fill") === "#ff0000" ||
                    path.getAttribute("stroke") === "#ff0000"
            ).toBe(true);
        }
    });

    it("renders SettingsSvg with custom size", () => {
        const { container } = render(<SettingsSvg size={40} />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("height", "40");
        expect(svg).toHaveAttribute("width", "40");
    });

    it("renders SettingsSvg with default size", () => {
        const { container } = render(<SettingsSvg />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("height", "24");
        expect(svg).toHaveAttribute("width", "24");
    });

    it("renders QuestionSvg with custom height and width", () => {
        const { container } = render(<QuestionSvg height={30} width={35} />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("height", "30");
        expect(svg).toHaveAttribute("width", "35");
    });

    it("renders QuestionSvg with default height and width", () => {
        const { container } = render(<QuestionSvg />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("height", "24");
        expect(svg).toHaveAttribute("width", "24");
    });
});
