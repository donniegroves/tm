import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const updateSession = async (request: NextRequest) => {
    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        response = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );
        const user = await supabase.auth.getUser();

        if (request.nextUrl.pathname.startsWith("/inside") && user.error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (request.nextUrl.pathname === "/login" && !user.error) {
            return NextResponse.redirect(new URL("/inside", request.url));
        }

        return response;
    } catch (e) {
        console.error("Error in updateSession middleware:", e);
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
};

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Middleware will apply to all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
