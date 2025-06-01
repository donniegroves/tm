"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "database.types";
import { deleteQuestion } from "../actions/deleteQuestion";
import { insertQuestion } from "../actions/insertQuestion";
import { useInsideContext } from "../inside/InsideContext";

export default function QuestionsTable() {
    const queryClient = useQueryClient();
    const questionsIsFetching =
        queryClient.getQueryState(["questions"])?.fetchStatus === "fetching";
    const insertMutation = useMutation({
        mutationFn: insertQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deleteQuestion,
        onSettled: () => {
            queryClient.setQueryData(
                ["questions"],
                (
                    oldData: Database["public"]["Tables"]["questions"]["Row"][]
                ) => {
                    return oldData.filter(
                        (
                            question: Database["public"]["Tables"]["questions"]["Row"]
                        ) =>
                            question.id !== deleteMutation.variables?.questionId
                    );
                }
            );
        },
    });

    const { questions } = useInsideContext();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                Questions{" "}
                <Button
                    onPress={() => {
                        insertMutation.mutate({
                            preQuestion: Math.random()
                                .toString(36)
                                .substring(2, 7),
                            rankPrompt: Math.random()
                                .toString(36)
                                .substring(2, 7),
                        });
                    }}
                >
                    Add random question
                </Button>
            </h2>
            <div style={{ position: "relative" }}>
                {(insertMutation.isPending || questionsIsFetching) && (
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
                                    deleteMutation.variables?.questionId ===
                                    question.id
                                        ? "blur-xs"
                                        : ""
                                }
                            >
                                <TableCell>{question.id}</TableCell>
                                <TableCell>{question.pre_question}</TableCell>
                                <TableCell>{question.rank_prompt}</TableCell>
                                <TableCell>
                                    <Button
                                        onPress={() =>
                                            deleteMutation.mutate({
                                                questionId: question.id,
                                            })
                                        }
                                    >
                                        {deleteMutation.isPending &&
                                        deleteMutation.variables?.questionId ===
                                            question.id ? (
                                            <Spinner />
                                        ) : (
                                            "Delete"
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
