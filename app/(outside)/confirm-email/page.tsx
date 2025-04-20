import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ConfirmEmail({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
        redirect("/inside");
    }

    const params = await searchParams;
    const email = typeof params.email === "string" ? params.email : undefined;

    if (!email) {
        redirect("/signup");
    }

    return (
        <>
            <h1 className="text-4xl font-bold mb-10">
                Confirmation Email Sent
            </h1>
            <div>
                A verification email was sent to {email ?? "ERROR"}. Please
                follow the instructions in that email.
            </div>
        </>
    );
}
