import { createClient } from "@/utils/supabase/server";
import InsidePageContent from "../components/InsidePageContent";

export default async function InsidePage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    return <InsidePageContent user={user} />;
}
