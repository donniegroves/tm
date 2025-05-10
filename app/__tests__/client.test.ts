import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "../../utils/supabase/client";

jest.mock("@supabase/ssr", () => ({
    createBrowserClient: jest.fn(),
}));

describe("createClient", () => {
    it("should create a Supabase client with the correct environment variables", () => {
        const mockSupabaseClient = {};
        (createBrowserClient as jest.Mock).mockReturnValue(mockSupabaseClient);

        const client = createClient();

        expect(createBrowserClient).toHaveBeenCalledWith(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        expect(client).toBe(mockSupabaseClient);
    });
});
