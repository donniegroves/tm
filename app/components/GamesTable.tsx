"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { useInsideContext } from "../inside/InsideContext";
import AddGameButton from "./AddGameButton";
import AvatarWithName from "./AvatarWithName";
import { useFormattedTimestamp } from "./useFormattedTimestamp";
import DeleteGameButton from "./DeleteGameButton";
import { useState } from "react";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import EditGameButton from "./EditGameButton";

export default function GamesTable() {
    const [pendingRowId, setPendingRowId] = useState<number>(-1);

    const { games, allUsers, gameUsers } = useInsideContext();
    const formatTimestamp = useFormattedTimestamp();

    return (
        <div>
            <div className="flex flex-row items-center ml-2 mb-2">
                <h2 className="text-2xl font-bold mr-2">Games</h2>
                <AddGameButton />
            </div>

            <Table className="w-full" isStriped aria-label="Games">
                <TableHeader>
                    <TableColumn>Code</TableColumn>
                    <TableColumn>Host</TableColumn>
                    <TableColumn>Invitees</TableColumn>
                    <TableColumn className="w-32 text-center">
                        AI Bots
                    </TableColumn>
                    <TableColumn className="w-32 text-center">
                        Seconds/question
                    </TableColumn>
                    <TableColumn className="w-32 text-center">
                        Seconds/ranking
                    </TableColumn>
                    <TableColumn>Created date/time</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {games.map((game) => {
                        const host = allUsers.find(
                            (user) => user.user_id === game.host_user_id
                        );
                        return (
                            <TableRow
                                key={game.id}
                                className={
                                    pendingRowId === game.id ? "blur-xs" : ""
                                }
                            >
                                <TableCell className="font-mono w-16">
                                    {game.share_code}
                                </TableCell>
                                <TableCell className="w-24">
                                    {host && (
                                        <AvatarWithName
                                            limitNameWidth={false}
                                            userId={host.user_id}
                                            showProfileButton={false}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="w-32">
                                    <AvatarGroup>
                                        {gameUsers
                                            .filter(
                                                (gu) =>
                                                    gu.game_id === game.id &&
                                                    gu.user_id !==
                                                        game.host_user_id
                                            )
                                            .map((gu) => {
                                                const user = allUsers.find(
                                                    (u) =>
                                                        u.user_id === gu.user_id
                                                );
                                                return (
                                                    user && (
                                                        <Avatar
                                                            key={user.user_id}
                                                            size="sm"
                                                            src={
                                                                user.avatar_url ||
                                                                ""
                                                            }
                                                        >
                                                            {user.full_name}
                                                        </Avatar>
                                                    )
                                                );
                                            })}
                                    </AvatarGroup>
                                </TableCell>
                                <TableCell className="w-32 text-center">
                                    {game.num_static_ai}
                                </TableCell>
                                <TableCell className="w-32 text-center">
                                    {game.seconds_per_pre}
                                </TableCell>
                                <TableCell className="w-32 text-center">
                                    {game.seconds_per_rank}
                                </TableCell>
                                <TableCell>
                                    {formatTimestamp(game.created_at)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <DeleteGameButton
                                            gameId={game.id}
                                            setPendingRowId={setPendingRowId}
                                        />
                                        <EditGameButton
                                            gameId={game.id}
                                            pendingRowId={pendingRowId}
                                            setPendingRowId={setPendingRowId}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
