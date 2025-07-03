import { renderHook } from "@testing-library/react";
import { DateTime } from "luxon";
import { useFormattedTimestamp } from "../components/useFormattedTimestamp";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: jest.fn(),
}));

import { useInsideContext } from "../inside/InsideContext";
import { mockPublicUserRow } from "./helpers/helpers";

describe("useFormattedTimestamp", () => {
    const mockUser = mockPublicUserRow;
    const mockAllUsers = [
        mockUser,
        { user_id: "user2", timezone: "Europe/London" },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("formats the date in the user's timezone", () => {
        (useInsideContext as jest.Mock).mockReturnValue({
            loggedInUserId: "user1",
            allUsers: mockAllUsers,
        });
        const { result } = renderHook(() => useFormattedTimestamp());
        const isoString = "2025-05-19T15:30:00Z";
        const expected = DateTime.fromISO(isoString, {
            zone: "America/New_York",
        })
            .toFormat("M/d/yyyy h:mma")
            .toLowerCase();
        expect(result.current(isoString)).toBe(expected);
    });

    it("defaults to UTC if user not found", () => {
        (useInsideContext as jest.Mock).mockReturnValue({
            loggedInUserId: "notfound",
            allUsers: mockAllUsers,
        });
        const { result } = renderHook(() => useFormattedTimestamp());
        const isoString = "2025-05-19T15:30:00Z";
        const expected = DateTime.fromISO(isoString, { zone: "UTC" })
            .toFormat("M/d/yyyy h:mma")
            .toLowerCase();
        expect(result.current(isoString)).toBe(expected);
    });
});
