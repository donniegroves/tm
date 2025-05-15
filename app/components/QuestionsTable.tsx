import { Button } from "@heroui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { deleteQuestion } from "../actions/deleteQuestion";

interface QuestionsTableProps {
    questions: Array<{
        id: number;
        pre_question: string;
        rank_prompt: string;
    }>;
}

export default function QuestionsTable({ questions }: QuestionsTableProps) {
    return (
        <Table className="max-w-xl" aria-label="Questions">
            <TableHeader>
                <TableColumn>Id</TableColumn>
                <TableColumn>Pre Question</TableColumn>
                <TableColumn>Rank Prompt</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
                {questions.map((question) => (
                    <TableRow key={question.id}>
                        <TableCell>{question.id}</TableCell>
                        <TableCell>{question.pre_question}</TableCell>
                        <TableCell>{question.rank_prompt}</TableCell>
                        <TableCell>
                            <Button
                                onPress={async () =>
                                    await deleteQuestion(question.id)
                                }
                            >
                                Del
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
