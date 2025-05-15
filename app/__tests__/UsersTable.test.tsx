import { render, screen } from "@testing-library/react";
import UsersTable from "../components/UsersTable";

const mockUsers = [
    { user_id: "userid222", access_level: 22225 },
    { user_id: "userid333", access_level: 22226 },
];

describe("UsersTable", () => {
    it("renders users in the table", () => {
        render(<UsersTable users={mockUsers} ariaLabel="TestLabel" />);
        expect(screen.getByText("userid222")).toBeInTheDocument();
        expect(screen.getByText("22225")).toBeInTheDocument();
        expect(screen.getByText("userid333")).toBeInTheDocument();
        expect(screen.getByText("22226")).toBeInTheDocument();
        expect(
            screen.getByRole("grid", { name: "TestLabel" })
        ).toBeInTheDocument();
    });
});
