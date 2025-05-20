"use client";

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
import { insertQuestion } from "../actions/insertQuestion";
import { useInsideContext } from "../inside/InsideContext";

async function handleInsertQuestion() {
    console.log("Inserting question");
    await insertQuestion(
        Math.random().toString(36).substring(2, 7),
        Math.random().toString(36).substring(2, 7)
    );
}

export default function QuestionsTable() {
    const { questions } = useInsideContext();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                Questions{" "}
                <Button
                    onPress={() => {
                        handleInsertQuestion();
                    }}
                >
                    Add random question
                </Button>
            </h2>
            <Table className="w-full" isStriped aria-label="Questions">
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
        </div>
    );
}
