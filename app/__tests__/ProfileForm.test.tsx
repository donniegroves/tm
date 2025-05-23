import { render, screen } from "@testing-library/react";
import ProfileForm from "../components/ProfileForm";
import { InsideContextProvider } from "../inside/InsideContext";
import { mockPublicUserRow } from "../test-helpers";

const setup = (userOverrides = {}) => {
    const user = { ...mockPublicUserRow, ...userOverrides };
    render(
        <InsideContextProvider
            loggedInUserId={user.user_id}
            allUsers={[user]}
            gamesData={[]}
            questions={[]}
        >
            <ProfileForm />
        </InsideContextProvider>
    );
};

describe("ProfileForm", () => {
    it("renders username input with user value", () => {
        setup({ username: "testuser" });
        const input = screen.getByLabelText(/username/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue("testuser");
    });

    it("renders timezone select with user timezone selected", () => {
        setup({ timezone: "Asia/Tokyo" });
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
        setup();
        expect(screen.getByText("US Outlying Islands")).toBeInTheDocument();
        expect(screen.getByText("New Zealand (Auckland)")).toBeInTheDocument();
    });

    it("renders with empty values if user data is missing", () => {
        render(
            <InsideContextProvider
                loggedInUserId={"notfound"}
                allUsers={[]}
                gamesData={[]}
                questions={[]}
            >
                <ProfileForm />
            </InsideContextProvider>
        );
        expect(screen.getByLabelText(/username/i)).toHaveValue("");

        const option = screen.getByRole("button", {
            name: "Preferred timezone",
        });
        expect(option).toBeInTheDocument();
    });
});
