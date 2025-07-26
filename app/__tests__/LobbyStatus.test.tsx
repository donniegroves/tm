import { render, screen } from "@testing-library/react";
import { LobbyStatus } from "../play/[share_code]/LobbyStatus";

jest.mock("@/app/components/WaitingDots", () => {
    return function MockWaitingDots({ className }: { className?: string }) {
        return (
            <span data-testid="waiting-dots" className={className}>
                ...
            </span>
        );
    };
});

describe("LobbyStatus", () => {
    it("shows waiting for players when not all players are connected", () => {
        render(
            <LobbyStatus
                allPlayersAreConnected={false}
                loggedInUserIsHost={true}
            />
        );

        expect(screen.getByText("Waiting for Players")).toBeInTheDocument();
        expect(screen.getAllByTestId("waiting-dots")).toHaveLength(2);
    });

    it("shows waiting for players when not all players are connected and user is not host", () => {
        render(
            <LobbyStatus
                allPlayersAreConnected={false}
                loggedInUserIsHost={false}
            />
        );

        expect(screen.getByText("Waiting for Players")).toBeInTheDocument();
        expect(screen.getAllByTestId("waiting-dots")).toHaveLength(2);
    });

    it("shows waiting for host when all players are connected but user is not host", () => {
        render(
            <LobbyStatus
                allPlayersAreConnected={true}
                loggedInUserIsHost={false}
            />
        );

        expect(
            screen.getByText("Waiting for host to start the game")
        ).toBeInTheDocument();
        expect(screen.getAllByTestId("waiting-dots")).toHaveLength(1);
    });

    it("renders nothing when all players are connected and user is host", () => {
        const { container } = render(
            <LobbyStatus
                allPlayersAreConnected={true}
                loggedInUserIsHost={true}
            />
        );

        expect(container.firstChild).toBeNull();
    });
});
