import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";

describe("Footer", () => {
    it("renders the footer with the correct text", () => {
        render(<Footer />);

        const footerElement = screen.getByText(
            `© ${new Date().getFullYear()} ${
                process.env.NEXT_PUBLIC_APP_NAME || "App"
            }. All rights reserved.`
        );

        expect(footerElement).toBeInTheDocument();
    });
});
