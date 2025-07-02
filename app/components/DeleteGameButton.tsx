import { Button } from "@heroui/button";
import { Dispatch, SetStateAction } from "react";
import { useDeleteGame } from "../hooks/useDeleteGame";

interface DeleteGameButtonProps {
    gameId: number;
    setPendingRowId: Dispatch<SetStateAction<number>>;
}

export default function DeleteGameButton({
    gameId,
    setPendingRowId,
}: DeleteGameButtonProps) {
    const deleteMutation = useDeleteGame();

    return (
        <Button
            variant="solid"
            color="danger"
            onPress={() => {
                setPendingRowId(gameId);
                deleteMutation.mutate({ gameId });
            }}
        >
            Delete
        </Button>
    );
}
