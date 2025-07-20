import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useContext: () => null,
}));

describe("useRealtimeContext", () => {
    it("should throw if used outside RealtimeProvider", () => {
        expect(() => useRealtimeContext()).toThrow(
            "useRealtimeContext must be used within RealtimeProvider"
        );
    });
});
