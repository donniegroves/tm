"use client";

import { Button } from "@heroui/button";
import { insertQuestion } from "../actions/insertQuestion";
import { useInsideContext } from "../inside/InsideContext";
import GamesTable from "./GamesTable";
import QuestionsTable from "./QuestionsTable";
import UsersTable from "./UsersTable";

async function handleInsertQuestion() {
    await insertQuestion(
        Math.random().toString(36).substring(2, 7),
        Math.random().toString(36).substring(2, 7)
    );
}

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
                <div>
                    <h2 className="text-2xl font-bold mb-4">Current User</h2>
                    <UsersTable
                        users={[
                            {
                                user_id: loggedInUser.id,
                                access_level: loggedInUser.access_level,
                            },
                        ]}
                        ariaLabel="Current user"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        Other visible users
                    </h2>
                    <UsersTable
                        users={visibleUsers}
                        ariaLabel="Other visible users"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Games</h2>
                    <GamesTable games={games} />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        Questions{" "}
                        <Button
                            onPress={() => {
                                handleInsertQuestion();
                            }}
                        >
                            Add random question
                        </Button>
                    </h2>
                    <QuestionsTable questions={questions} />
                </div>
            </div>
        </>
    );
}
