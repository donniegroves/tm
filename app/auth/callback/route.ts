import { insertPublicUser } from "@/app/actions/insertPublicUser";
import { isUserIdInPublicUserTable } from "@/app/helpers";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
    const supabase = await createClient();

    if (!code) {
        return NextResponse.json(
            { error: "Unprocessable Entity" },
            { status: 422 }
        );
    }

    try {
        const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            throw exchangeError;
        } else if (!exchangeData.user) {
            console.log("User not found during exchange process");
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (!isUserIdInPublicUserTable(exchangeData.user.id)) {
            insertPublicUser(exchangeData.user.id);
        }

        if (redirectTo) {
            return NextResponse.redirect(`${origin}${redirectTo}`);
        }

        return NextResponse.redirect(`${origin}/inside`);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Error during exchange process" },
            { status: 500 }
        );
    }
}
