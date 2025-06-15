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

export default function GamesTable() {
    const { games, allUsers } = useInsideContext();
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
                </TableHeader>
                <TableBody>
                    {games.map((game) => {
                        const host = allUsers.find(
                            (user) => user.user_id === game.host_user_id
                        );
                        return (
                            <TableRow key={game.id}>
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
                                <TableCell className="w-32 text-center">
                                    {game.num_static_ai ?? 0}
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
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
