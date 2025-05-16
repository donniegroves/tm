"use client";

import { useInsideContext } from "../inside/InsideContext";
import GamesTable from "./GamesTable";
import QuestionsTable from "./QuestionsTable";
import UsersTable from "./UsersTable";

export default function InsideContent() {
    const {
        loggedInUser,
        otherUsers: visibleUsers,
        visibleGames: games,
        questions,
    } = useInsideContext();

    return (
        <>
            <div className="flex flex-col gap-y-5 mb-10">
                <UsersTable
                    users={[
                        {
                            user_id: loggedInUser.id,
                            access_level: loggedInUser.access_level,
                        },
                    ]}
                    ariaLabel="Current user"
                />
                <UsersTable
                    users={visibleUsers}
                    ariaLabel="Other visible users"
                />
                <GamesTable games={games} />
                <QuestionsTable questions={questions} />
            </div>
        </>
    );
}
