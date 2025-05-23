import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import DrawerProvider from "../inside/DrawerProvider";
import { InsideContextProvider } from "../inside/InsideContext";
import { mockPublicUserRow } from "../test-helpers";

const setup = () => {
    render(
        <InsideContextProvider
            loggedInUserId={mockPublicUserRow.user_id}
            allUsers={[mockPublicUserRow]}
            gamesData={[]}
            questions={[]}
        >
            <DrawerProvider>
                <Header />
            </DrawerProvider>
        </InsideContextProvider>
    );
};

describe("Header", () => {
    it("renders the header with user information", () => {
        setup();

        expect(screen.getByRole("img", { name: "Logo" }));
        expect(
            screen.getByRole("heading", { level: 1, name: "App" })
        ).toBeInTheDocument();
    });
});
