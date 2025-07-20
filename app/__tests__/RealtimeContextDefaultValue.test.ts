import { defaultValue } from "../play/[share_code]/RealtimeContext";

describe("RealtimeContext defaultValue", () => {
    it("provides safe no-op setter functions", () => {
        expect(typeof defaultValue.setReadyUsers).toBe("function");
        expect(typeof defaultValue.setChannel).toBe("function");
        expect(typeof defaultValue.setCursor).toBe("function");

        expect(() =>
            defaultValue.setReadyUsers(["user1", "user2"])
        ).not.toThrow();
        expect(() => defaultValue.setChannel(null)).not.toThrow();
        expect(() => defaultValue.setCursor({ x: 100, y: 200 })).not.toThrow();
    });
});
