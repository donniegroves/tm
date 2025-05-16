import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";

interface UsersTableProps {
    users: Array<{
        user_id: string;
        access_level: number;
    }>;
    ariaLabel?: string;
}

export default function UsersTable({ users, ariaLabel }: UsersTableProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{ariaLabel}</h2>
            <Table className="max-w-xl" aria-label={ariaLabel}>
                <TableHeader>
                    <TableColumn>User ID</TableColumn>
                    <TableColumn>Access Level</TableColumn>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.user_id}>
                            <TableCell>{user.user_id}</TableCell>
                            <TableCell>{user.access_level}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
