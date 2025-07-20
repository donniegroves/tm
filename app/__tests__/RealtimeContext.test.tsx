import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { RealtimeContext } from "../play/[share_code]/RealtimeContext";
import { createWrapper } from "./helpers/createWrapper";
import { defaultRealtimeContextValues } from "./helpers/helpers";

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
        render(<TestConsumer />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                readyUsers: ["user1", "user2", "user3"],
            }),
        });

        expect(screen.getByTestId("channel-status")).toHaveTextContent(
            "channel-exists"
        );
        expect(screen.getByTestId("ready-users")).toHaveTextContent(
            "user1,user2,user3"
        );
    });

    it("provides empty ready users array when no users are ready", () => {
        render(<TestConsumer />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                readyUsers: [],
            }),
        });

        expect(screen.getByTestId("channel-status")).toHaveTextContent(
            "channel-exists"
        );
        expect(screen.getByTestId("ready-users")).toHaveTextContent("no-users");
    });

    it("handles null channel correctly", () => {
        render(<TestConsumer />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                channel: null,
                readyUsers: ["user1"],
            }),
        });

        expect(screen.getByTestId("channel-status")).toHaveTextContent(
            "no-channel"
        );
        expect(screen.getByTestId("ready-users")).toHaveTextContent("user1");
    });
});
