import { screen } from "@testing-library/react";
import AvatarWithName from "../components/AvatarWithName";
import { mockPublicUserRow, renderWithContext } from "../test-helpers";

jest.mock("../components/HeaderProfileDropdown", () => {
    const MockProfileDropdown = () => (
        <div data-testid="profile-dropdown">ProfileDropdown</div>
    );
    MockProfileDropdown.displayName = "MockProfileDropdown";
    return MockProfileDropdown;
});

describe("AvatarWithName", () => {
    it("renders avatar, name, and username", () => {
        renderWithContext(
            <AvatarWithName
                userId={mockPublicUserRow.user_id}
                showProfileButton={false}
                limitNameWidth={true}
            />
        );
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
        renderWithContext(
            <AvatarWithName
                userId={mockPublicUserRow.user_id}
                showProfileButton={true}
                limitNameWidth={true}
            />
        );
        expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();
    });

    it("does not show the profile button when showProfileButton is false", () => {
        renderWithContext(
            <AvatarWithName
                userId={mockPublicUserRow.user_id}
                showProfileButton={false}
                limitNameWidth={true}
            />
        );
        expect(screen.queryByTestId("profile-dropdown")).toBeNull();
    });

    it("uses loggedInUserId if userId is not passed in", () => {
        renderWithContext(
            <AvatarWithName
                userId={undefined}
                showProfileButton={false}
                limitNameWidth={true}
            />
        );
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
        renderWithContext(
            <AvatarWithName
                userId={mockPublicUserRow.user_id}
                showProfileButton={false}
                limitNameWidth={false}
            />
        );
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
        renderWithContext(<AvatarWithName userId={userWithNulls.user_id} />, {
            loggedInUserId: userWithNulls.user_id,
            allUsers: [userWithNulls],
            gamesData: [],
            questions: [],
        });

        const avatarImg = screen.getByRole("img");
        expect(avatarImg).not.toHaveAttribute("src");
    });
});
