import { render, screen } from "@testing-library/react";
import ProfileForm from "../components/ProfileForm";
import {
    mockPublicUserRow,
    mockUseInsideContext,
    setMockInsideContext,
} from "../test-helpers";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));
beforeEach(() => {
    setMockInsideContext();
});

describe("ProfileForm", () => {
    it("renders username input with user value", () => {
        render(<ProfileForm />);
        const input = screen.getByLabelText(/username/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue("testuser");
    });

    it("renders timezone select with user timezone selected", () => {
        setMockInsideContext({
            allUsers: [{ ...mockPublicUserRow, timezone: "Asia/Tokyo" }],
        });

        render(<ProfileForm />);
        const select = screen.getByRole("button", {
            name: /preferred timezone/i,
        });
        expect(select).toBeInTheDocument();
        const option = screen.getByRole("button", {
            name: "Japan (Tokyo) Preferred timezone",
        });
        expect(option).toBeInTheDocument();
    });

    it("renders all timezone options", () => {
        render(<ProfileForm />);
        expect(screen.getByText("US Outlying Islands")).toBeInTheDocument();
        expect(screen.getByText("New Zealand (Auckland)")).toBeInTheDocument();
    });

    it("renders with empty values if user data is missing", () => {
        setMockInsideContext({
            loggedInUserId: "notfound",
            allUsers: [],
        });

        render(<ProfileForm />);
        expect(screen.getByLabelText(/username/i)).toHaveValue("");

        const option = screen.getByRole("button", {
            name: "Preferred timezone",
        });
        expect(option).toBeInTheDocument();
    });
});
