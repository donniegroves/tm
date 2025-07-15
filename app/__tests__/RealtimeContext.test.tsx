import { RealtimeChannel } from "@supabase/supabase-js";
import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { RealtimeContext } from "../play/[share_code]/RealtimeContext";

function TestConsumer() {
    const { channel, readyUsers } = useContext(RealtimeContext);
    return (
        <div>
            <div data-testid="channel-status">
                {channel ? "channel-exists" : "no-channel"}
            </div>
            <div data-testid="ready-users">
                {readyUsers.length > 0 ? readyUsers.join(",") : "no-users"}
            </div>
        </div>
    );
}

describe("RealtimeContext", () => {
    it("provides default values when no provider is used", () => {
        render(<TestConsumer />);

        expect(screen.getByTestId("channel-status")).toHaveTextContent(
            "no-channel"
        );
        expect(screen.getByTestId("ready-users")).toHaveTextContent("no-users");
    });

    it("provides custom values when provider is used", () => {
        const mockChannel = {
            id: "test-channel",
            send: jest.fn(),
            subscribe: jest.fn(),
        } as unknown as RealtimeChannel;

        const contextValue = {
            channel: mockChannel,
            readyUsers: ["user1", "user2", "user3"],
            setReadyUsers: jest.fn(),
        };

        render(
            <RealtimeContext.Provider value={contextValue}>
                <TestConsumer />
            </RealtimeContext.Provider>
        );

        expect(screen.getByTestId("channel-status")).toHaveTextContent(
            "channel-exists"
        );
        expect(screen.getByTestId("ready-users")).toHaveTextContent(
            "user1,user2,user3"
        );
    });

    it("provides empty ready users array when no users are ready", () => {
        const mockChannel = {
            id: "test-channel",
            send: jest.fn(),
            subscribe: jest.fn(),
        } as unknown as RealtimeChannel;

        const contextValue = {
            channel: mockChannel,
            readyUsers: [],
            setReadyUsers: jest.fn(),
        };

        render(
            <RealtimeContext.Provider value={contextValue}>
                <TestConsumer />
            </RealtimeContext.Provider>
        );

        expect(screen.getByTestId("channel-status")).toHaveTextContent(
            "channel-exists"
        );
        expect(screen.getByTestId("ready-users")).toHaveTextContent("no-users");
    });

    it("handles null channel correctly", () => {
        const contextValue = {
            channel: null,
            readyUsers: ["user1"],
            setReadyUsers: jest.fn(),
        };

        render(
            <RealtimeContext.Provider value={contextValue}>
                <TestConsumer />
            </RealtimeContext.Provider>
        );

        expect(screen.getByTestId("channel-status")).toHaveTextContent(
            "no-channel"
        );
        expect(screen.getByTestId("ready-users")).toHaveTextContent("user1");
    });
});
