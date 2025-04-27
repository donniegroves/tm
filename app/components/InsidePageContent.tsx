"use client";

import { Button } from "@heroui/button";
import { User } from "@supabase/supabase-js";
import { signOutAction } from "../actions";

export default function InsidePageContent({ user }: { user: User | null }) {
    if (!user) {
        return <div>loading...</div>;
    }

    const handleSignOutClick = async () => {
        await signOut();
    };

    return (
        <div>
            Inside (protected) page
            {user && (
                <div>
                    <div>id: {user.id}</div>
                    <div>email: {user.email}</div>
                    <div>confirmation_sent_at: {user.confirmation_sent_at}</div>
                    <Button onPress={handleSignOutClick}>Sign out</Button>
                </div>
            )}
        </div>
    );
}
