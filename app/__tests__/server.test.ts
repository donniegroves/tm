import { createClient } from "@/utils/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

jest.mock("@supabase/ssr", () => ({
    createServerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

describe("createClient", () => {
    const mockCookies = {
        getAll: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
        (cookies as jest.Mock).mockResolvedValue(mockCookies);
    });

    it("should call createServerClient with correct arguments", async () => {
        await createClient();

        expect(createServerClient).toHaveBeenCalledWith(
            "https://example.supabase.co",
            "anon-key",
            expect.objectContaining({
                cookies: expect.any(Object),
            })
        );
    });

    it("should call cookies.getAll when getAll is invoked", async () => {
        await createClient();
        const cookieConfig = (createServerClient as jest.Mock).mock.calls[0][2]
            .cookies;

        cookieConfig.getAll();
        expect(mockCookies.getAll).toHaveBeenCalled();
    });

    it("should call cookies.set for each cookie in setAll", async () => {
        await createClient();
        const cookieConfig = (createServerClient as jest.Mock).mock.calls[0][2]
            .cookies;

        const cookiesToSet = [
            { name: "test1", value: "value1", options: { path: "/" } },
            { name: "test2", value: "value2", options: { path: "/" } },
        ];

        cookieConfig.setAll(cookiesToSet);

        expect(mockCookies.set).toHaveBeenCalledTimes(2);
        expect(mockCookies.set).toHaveBeenCalledWith("test1", "value1", {
            path: "/",
        });
        expect(mockCookies.set).toHaveBeenCalledWith("test2", "value2", {
            path: "/",
        });
    });

    it("should log an error if setAll throws an exception", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();
        await createClient();
        const cookieConfig = (createServerClient as jest.Mock).mock.calls[0][2]
            .cookies;

        mockCookies.set.mockImplementation(() => {
            throw new Error("Test error");
        });

        const cookiesToSet = [{ name: "test", value: "value", options: {} }];
        cookieConfig.setAll(cookiesToSet);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error setting cookies:",
            expect.any(Error)
        );
        consoleErrorSpy.mockRestore();
    });
});
