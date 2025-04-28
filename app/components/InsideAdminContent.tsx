"use client";

import { Button } from "@heroui/button";
import { Database } from "database.types";
import { signOut } from "../actions/signOut";

export default function InsideAdminContent({
    user,
    games,
}: {
    user: Database["public"]["Tables"]["users"]["Row"];
    games: Database["public"]["Tables"]["games"]["Row"][];
}) {
    const handleSignOutClick = async () => {
        await signOut();
    };

    return (
        <div>
            <div className="text-left mb-8">
                <h3 className="text-xl font-bold">Logged in user</h3>
                <div>user_id: {user.user_id}</div>
                <div>access_level: {user.access_level}</div>
                <Button onPress={handleSignOutClick}>Sign out</Button>
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex-1">
                    <h3 className="text-xl text-center font-bold">Users</h3>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl text-center font-bold">Games</h3>
                    <ul>
                        {games.map((game) => (
                            <li key={game.id} className="mb-4">
                                <div>id: {game.id}</div>
                                <div>host_user_id: {game.host_user_id}</div>
                                <div>share_code: {game.share_code}</div>
                                <div>num_static_ai: {game.num_static_ai}</div>
                                <div>
                                    seconds_per_pre: {game.seconds_per_pre}
                                </div>
                                <div>
                                    seconds_per_rank: {game.seconds_per_rank}
                                </div>
                                <div>created_at: {game.created_at}</div>
                                <div>updated_at: {game.updated_at}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl text-center font-bold">Questions</h3>
                </div>
            </div>
        </div>
    );
}
