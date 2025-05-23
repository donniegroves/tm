import { render, screen } from "@testing-library/react";
import InsideNav from "../components/InsideNav";
import DrawerProvider from "../inside/DrawerProvider";
import { InsideContextProvider } from "../inside/InsideContext";
import { mockPublicUserRow } from "../test-helpers";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

const setup = () =>
    render(
        <InsideContextProvider
            loggedInUserId={mockPublicUserRow.user_id}
            allUsers={[mockPublicUserRow]}
            gamesData={[]}
            questions={[]}
        >
            <DrawerProvider>
                <InsideNav />
            </DrawerProvider>
        </InsideContextProvider>
    );

describe("InsideNav", () => {
    it("renders all navigation menu items", () => {
        setup();
        expect(screen.getByRole("navigation")).toBeInTheDocument();
        expect(screen.getByLabelText("Games")).toBeInTheDocument();
        expect(screen.getByLabelText("Users")).toBeInTheDocument();
        expect(screen.getByLabelText("Questions")).toBeInTheDocument();
        expect(screen.getByLabelText("Settings")).toBeInTheDocument();
    });
});
