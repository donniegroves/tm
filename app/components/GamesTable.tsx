import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";

interface GamesTableProps {
    games: Array<{
        id: number | string;
        share_code: string;
    }>;
}

export default function GamesTable({ games }: GamesTableProps) {
    return (
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
    );
}
