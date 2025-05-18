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

interface UsersTableProps {
    ariaLabel?: string;
}

export default function UsersTable({ ariaLabel }: UsersTableProps) {
    const { allUsers } = useInsideContext();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{ariaLabel}</h2>
            <Table className="max-w-xl" aria-label={ariaLabel}>
                <TableHeader>
                    <TableColumn>Access Level</TableColumn>
                    <TableColumn>Avatar URL</TableColumn>
                    <TableColumn>Created At</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Full Name</TableColumn>
                    <TableColumn>Timezone</TableColumn>
                    <TableColumn>Updated At</TableColumn>
                    <TableColumn>User ID</TableColumn>
                    <TableColumn>Username</TableColumn>
                </TableHeader>
                <TableBody>
                    {allUsers.map((user) => (
                        <TableRow key={user.user_id}>
                            <TableCell>{user.access_level}</TableCell>
                            <TableCell>{user.avatar_url}</TableCell>
                            <TableCell>{user.created_at}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.timezone}</TableCell>
                            <TableCell>{user.updated_at}</TableCell>
                            <TableCell>{user.user_id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
