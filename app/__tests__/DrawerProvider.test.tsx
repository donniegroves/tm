import { render } from "@testing-library/react";
import { useDrawer } from "../inside/DrawerProvider";

function TestComponent() {
    useDrawer();
    return null;
}

describe("DrawerProvider", () => {
    it("throws if useDrawer is called outside of provider", () => {
        expect(() => render(<TestComponent />)).toThrow(
            "useDrawer must be used within DrawerContext"
        );
    });
});
