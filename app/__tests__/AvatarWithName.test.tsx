import { render, screen } from "@testing-library/react";
import AvatarWithName from "../components/AvatarWithName";
import { mockPublicUserRow } from "../test-helpers";

describe("AvatarWithName", () => {
    it("renders avatar, name, and username", () => {
        render(<AvatarWithName user={mockPublicUserRow} />);
        console.log("testing", mockPublicUserRow);
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
        render(<AvatarWithName user={mockPublicUserRow} showProfileButton />);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("does not show the profile button when showProfileButton is false", () => {
        render(
            <AvatarWithName
                user={mockPublicUserRow}
                showProfileButton={false}
            />
        );
        expect(screen.queryByRole("button")).toBeNull();
    });
});
