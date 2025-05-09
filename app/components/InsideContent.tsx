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

export default function InsideContent() {
    const loggedInUser = useInsideContext().loggedInUser;
    const visibleUsers = useInsideContext().otherUsers;
    const games = useInsideContext().visibleGames;

    return (
        <>
            <div className="flex flex-col gap-y-5 mb-10">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Current User</h2>
                    <Table className="max-w-xl" aria-label="Current user">
                        <TableHeader>
                            <TableColumn>User ID</TableColumn>
                            <TableColumn>Access Level</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>{loggedInUser.id}</TableCell>
                                <TableCell>
                                    {loggedInUser.access_level}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        Other visible users
                    </h2>
                    <Table
                        className="max-w-xl"
                        aria-label="Other visible users"
                    >
                        <TableHeader>
                            <TableColumn>User ID</TableColumn>
                            <TableColumn>Access Level</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {visibleUsers.map((user) => (
                                <TableRow key={user.user_id}>
                                    <TableCell>{user.user_id}</TableCell>
                                    <TableCell>{user.access_level}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Games</h2>
                    <Table className="max-w-xl" aria-label="Games">
                        <TableHeader>
                            <TableColumn>Game ID</TableColumn>
                            <TableColumn>Share Code</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {games.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell>{game.id}</TableCell>
                                    <TableCell>{game.share_code}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
