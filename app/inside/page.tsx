import { createClient } from "@/utils/supabase/server";
import { AccessLevel } from "../common";
import InsideAdminContent from "../components/InsideAdminContent";
import SignOutButton from "../components/SignOutButton";

export default async function InsidePage() {
    try {
        const supabase = await createClient();
        const { data: authUserData, error: authUserError } =
            await supabase.auth.getUser();

        if (authUserError || !authUserData.user) {
            throw new Error(
                "User not authenticated or error fetching user data"
            );
        }

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", authUserData.user?.id)
            .single();

        if (userError || !userData) {
            throw new Error("User not found in database");
        }

        const { data: gamesData, error: gamesError } = await supabase
            .from("games")
            .select();

        if (gamesError || !gamesData) {
            throw new Error("Error fetching games data");
        }

        if (userData.access_level == AccessLevel.SUPERADMIN) {
            return <InsideAdminContent user={userData} games={gamesData} />;
        } else {
            return (
                <div>
                    <p>user level access</p>
                    <SignOutButton />
                </div>
            );
        }
    } catch (error) {
        console.error("Error loading data:", error);
        return <div>Error loading data: see console</div>;
    }
}
