import { render, screen, fireEvent } from "@testing-library/react";
import GenerateShareCodeButton from "./GenerateShareCodeButton";

describe("GenerateShareCodeButton", () => {
    it("calls codeSetter with a 6-character code when pressed", () => {
        const codeSetter = jest.fn();
        render(<GenerateShareCodeButton codeSetter={codeSetter} />);
        const button = screen.getByRole("button", { name: /generate share code/i });
        fireEvent.click(button);
        expect(codeSetter).toHaveBeenCalledTimes(1);
        const code = codeSetter.mock.calls[0][0];
        expect(typeof code).toBe("string");
        expect(code.length).toBe(6);
        expect(code).toMatch(/^[A-Z]{6}$/);
    });
});
