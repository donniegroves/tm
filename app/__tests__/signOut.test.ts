import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "../actions/signOut";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("signOut", () => {
    it("should sign out the user and redirect to /login", async () => {
        const mockSignOut = jest.fn().mockResolvedValue({ error: null });
        const mockSupabase = { auth: { signOut: mockSignOut } };

        (createClient as jest.Mock).mockResolvedValue(mockSupabase);

        await expect(signOut()).resolves.not.toThrow();

        expect(createClient).toHaveBeenCalled();
        expect(mockSignOut).toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith("/login");
    });
});
