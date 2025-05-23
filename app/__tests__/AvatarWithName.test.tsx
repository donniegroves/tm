import { render, screen } from "@testing-library/react";
import AvatarWithName from "../components/AvatarWithName";
import { InsideContextProvider } from "../inside/InsideContext";
import { mockPublicUserRow } from "../test-helpers";

jest.mock("../components/HeaderProfileDropdown", () => {
    const MockProfileDropdown = () => (
        <div data-testid="profile-dropdown">ProfileDropdown</div>
    );
    MockProfileDropdown.displayName = "MockProfileDropdown";
    return MockProfileDropdown;
});

const setup = (
    userId: string | undefined,
    showProfileButton: boolean,
    limitNameWidth: boolean
) =>
    render(
        <InsideContextProvider
            loggedInUserId={mockPublicUserRow.user_id}
            allUsers={[mockPublicUserRow]}
            gamesData={[]}
            questions={[]}
        >
            <AvatarWithName
                userId={userId}
                showProfileButton={showProfileButton}
                limitNameWidth={limitNameWidth}
            />
        </InsideContextProvider>
    );

describe("AvatarWithName", () => {
    it("renders avatar, name, and username", () => {
        setup(mockPublicUserRow.user_id, false, true);
        expect(
            screen.getByRole("img", { name: mockPublicUserRow.full_name ?? "" })
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicUserRow.full_name ?? "")
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicUserRow.username ?? "")
        ).toBeInTheDocument();
    });

    it("shows the profile button when showProfileButton is true", () => {
        setup(mockPublicUserRow.user_id, true, true);
        expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();
    });

    it("does not show the profile button when showProfileButton is false", () => {
        setup(mockPublicUserRow.user_id, false, true);
        expect(screen.queryByTestId("profile-dropdown")).toBeNull();
    });

    it("uses loggedInUserId if userId is not passed in", () => {
        setup(undefined, false, true);
        expect(
            screen.getByRole("img", { name: mockPublicUserRow.full_name ?? "" })
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicUserRow.full_name ?? "")
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockPublicUserRow.username ?? "")
        ).toBeInTheDocument();
    });

    it("applies max-w-full when limitNameWidth is false", () => {
        setup(mockPublicUserRow.user_id, false, false);
        const nameDiv = screen.getByText(
            mockPublicUserRow.full_name ?? ""
        ).parentElement;
        expect(nameDiv).toHaveClass("max-w-full");
    });

    it("renders fallback avatar and name when full_name and avatar_url are null", () => {
        const userWithNulls = {
            ...mockPublicUserRow,
            full_name: null,
            avatar_url: null,
        };
        render(
            <InsideContextProvider
                loggedInUserId={userWithNulls.user_id}
                allUsers={[userWithNulls]}
                gamesData={[]}
                questions={[]}
            >
                <AvatarWithName userId={userWithNulls.user_id} />
            </InsideContextProvider>
        );

        const avatarImg = screen.getByRole("img");
        expect(avatarImg).not.toHaveAttribute("src");
    });
});
