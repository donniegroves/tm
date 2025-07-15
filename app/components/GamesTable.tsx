"use client";

import { Avatar, AvatarGroup } from "@heroui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import Link from "next/link";
import { useState } from "react";
import { useInsideContext } from "../inside/InsideContext";
import AddGameButton from "./AddGameButton";
import AvatarWithName from "./AvatarWithName";
import DeleteGameButton from "./DeleteGameButton";
import EditGameButton from "./EditGameButton";
import { useFormattedTimestamp } from "./useFormattedTimestamp";

export enum GameStatus {
    Waiting = 0,
    InProgress = 1,
    Finished = 2,
}

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
                    <TableColumn>Status</TableColumn>
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
                        const hostGu = gameUsers.find(
                            (gu) => gu.game_id === game.id && gu.is_host
                        );
                        const host = hostGu
                            ? allUsers.find(
                                  (user) => user.user_id === hostGu.user_id
                              )
                            : undefined;
                        return (
                            <TableRow
                                key={game.id}
                                className={
                                    pendingRowId === game.id ? "blur-xs" : ""
                                }
                            >
                                <TableCell className="font-mono w-16">
                                    <Link href={`/play/${game.share_code}`}>
                                        {game.share_code}
                                    </Link>
                                </TableCell>
                                <TableCell>{GameStatus[game.status]}</TableCell>
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
                                                    gu.is_host === false
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
