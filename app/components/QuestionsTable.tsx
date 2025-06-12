"use client";

import { Spinner } from "@heroui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useInsideContext } from "../inside/InsideContext";
import AddQuestionButton from "./AddQuestionButton";
import DeleteQuestionButton from "./DeleteQuestionButton";
import EditQuestionButton from "./EditQuestionButton";

export default function QuestionsTable() {
    const [pendingRowId, setPendingRowId] = useState<number>(-1);

    const queryClient = useQueryClient();
    const questionsIsFetching =
        queryClient.getQueryState(["questions"])?.fetchStatus === "fetching";

    const { questions } = useInsideContext();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                Questions <AddQuestionButton />
            </h2>
            <div style={{ position: "relative" }}>
                {questionsIsFetching && (
                    <div className="absolute inset-0 bg-white/10 z-10 flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
                <Table className="w-full" isStriped aria-label="Questions">
                    <TableHeader>
                        <TableColumn>Id</TableColumn>
                        <TableColumn>Pre Question</TableColumn>
                        <TableColumn>Rank Prompt</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow
                                key={question.id}
                                className={
                                    pendingRowId === question.id
                                        ? "blur-xs"
                                        : ""
                                }
                            >
                                <TableCell>{question.id}</TableCell>
                                <TableCell>{question.pre_question}</TableCell>
                                <TableCell>{question.rank_prompt}</TableCell>
                                <TableCell>
                                    <div className="flex flex-row space-x-2">
                                        <DeleteQuestionButton
                                            questionId={question.id}
                                            setPendingRowId={setPendingRowId}
                                        />
                                        <EditQuestionButton
                                            questionId={question.id}
                                            pendingRowId={pendingRowId}
                                            setPendingRowId={setPendingRowId}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
