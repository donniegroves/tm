import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Dispatch, SetStateAction } from "react";
import { useDeleteQuestion } from "../hooks/useDeleteQuestion";

export default function DeleteQuestionButton({
    questionId,
    setPendingRowId,
}: {
    questionId: number;
    setPendingRowId: Dispatch<SetStateAction<number>>;
}) {
    const deleteMutation = useDeleteQuestion();

    return (
        <Button
            onPress={async () => {
                setPendingRowId(questionId);
                await deleteMutation.mutateAsync({
                    questionId,
                });
                setPendingRowId(-1);
            }}
        >
            {deleteMutation.isPending &&
            deleteMutation.variables?.questionId === questionId ? (
                <Spinner />
            ) : (
                "Delete"
            )}
        </Button>
    );
}
