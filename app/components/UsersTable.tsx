"use client";

import { Checkbox } from "@heroui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { AccessLevel } from "../common";
import { useInsideContext } from "../inside/InsideContext";
import AvatarWithName from "./AvatarWithName";
import { useFormattedTimestamp } from "./useFormattedTimestamp";

interface UsersTableProps {
    ariaLabel?: string;
}

export default function UsersTable({ ariaLabel }: UsersTableProps) {
    const { allUsers } = useInsideContext();
    const formatTimestamp = useFormattedTimestamp();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{ariaLabel}</h2>
            <Table className="w-full" isStriped aria-label={ariaLabel}>
                <TableHeader>
                    <TableColumn>Name / Username</TableColumn>
                    <TableColumn className="text-center">
                        SuperAdmin
                    </TableColumn>
                    <TableColumn>Created At</TableColumn>
                    <TableColumn>Email / UserId</TableColumn>
                </TableHeader>
                <TableBody>
                    {allUsers.map((user) => (
                        <TableRow key={user.user_id}>
                            <TableCell className="w-48">
                                <AvatarWithName
                                    userId={user.user_id}
                                    showProfileButton={false}
                                    limitNameWidth={false}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <Checkbox
                                    classNames={{
                                        base: "opacity-100",
                                    }}
                                    radius="full"
                                    isDisabled
                                    isReadOnly
                                    isSelected={
                                        user.access_level ==
                                        AccessLevel.SUPERADMIN
                                    }
                                />
                            </TableCell>
                            <TableCell className="w-32">
                                <div className="w-32">
                                    {formatTimestamp(user.created_at)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>{user.email}</div>
                                <div className="text-xs w-72 font-mono">
                                    {user.user_id}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
