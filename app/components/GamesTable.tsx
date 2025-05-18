"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { DateTime } from "luxon";
import { useInsideContext } from "../inside/InsideContext";

export default function GamesTable() {
    const { gamesData } = useInsideContext();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Games</h2>
            <Table className="max-w-xl" aria-label="Games">
                <TableHeader>
                    <TableColumn>Created date/time</TableColumn>
                    <TableColumn>Game Code</TableColumn>
                    <TableColumn>Host</TableColumn>
                    <TableColumn>AI Bots</TableColumn>
                    <TableColumn>Seconds per question</TableColumn>
                    <TableColumn>Seconds per ranking</TableColumn>
                </TableHeader>
                <TableBody>
                    {gamesData.map((game) => (
                        <TableRow key={game.id}>
                            <TableCell>
                                {/* TODO: use user's timezone */}
                                {DateTime.fromISO(game.created_at).toFormat(
                                    "M/d/yyyy h:mma"
                                )}
                            </TableCell>
                            <TableCell>{game.share_code}</TableCell>
                            {/* TODO: add host avatar and name for host */}
                            <TableCell>{game.host_user_id}</TableCell>
                            <TableCell>{game.num_static_ai}</TableCell>
                            <TableCell>{game.seconds_per_pre}</TableCell>
                            <TableCell>{game.seconds_per_rank}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
