import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "../components/ThemeSwitcher";

describe("ThemeSwitcher", () => {
    beforeAll(() => {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });

    it("renders the current theme", () => {
        render(
            <ThemeProvider>
                <ThemeSwitcher />
            </ThemeProvider>
        );

        expect(screen.getByText(/The current theme is:/)).toBeInTheDocument();
    });

    it("switches to light mode when the Light Mode button is clicked", async () => {
        render(
            <ThemeProvider>
                <ThemeSwitcher />
            </ThemeProvider>
        );

        const lightModeButton = screen.getByText("Light Mode");
        fireEvent.click(lightModeButton);

        await waitFor(() => {
            expect(
                screen.getByText(/The current theme is: light/)
            ).toBeInTheDocument();
        });
    });

    it("switches to dark mode when the Dark Mode button is clicked", async () => {
        render(
            <ThemeProvider>
                <ThemeSwitcher />
            </ThemeProvider>
        );

        const darkModeButton = screen.getByText("Dark Mode");
        fireEvent.click(darkModeButton);

        await waitFor(() => {
            expect(
                screen.getByText(/The current theme is: dark/)
            ).toBeInTheDocument();
        });
    });

    it("switches to system mode when the System Mode button is clicked", async () => {
        render(
            <ThemeProvider>
                <ThemeSwitcher />
            </ThemeProvider>
        );

        const systemModeButton = screen.getByText("System Mode");
        fireEvent.click(systemModeButton);

        await waitFor(() => {
            expect(
                screen.getByText(/The current theme is: system/)
            ).toBeInTheDocument();
        });
    });
});
