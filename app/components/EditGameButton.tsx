import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Dispatch, SetStateAction } from "react";
import { useDrawer } from "../inside/DrawerProvider";
import DrawerFooter, { DrawerFooterPurpose } from "./DrawerFooter";
import EditGameForm from "./EditGameForm";

export default function EditGameButton({
    gameId,
    pendingRowId,
    setPendingRowId,
}: {
    gameId: number;
    pendingRowId: number;
    setPendingRowId: Dispatch<SetStateAction<number>>;
}) {
    const { setIsDrawerOpen, setDrawerContent } = useDrawer();

    const editGameHeader = <div className="text-lg font-bold">Edit game</div>;

    return (
        <Button
            onPress={async () => {
                setPendingRowId(gameId);
                setDrawerContent({
                    header: editGameHeader,
                    body: <EditGameForm gameId={gameId} />,
                    footer: (
                        <DrawerFooter
                            purpose={DrawerFooterPurpose.EditGame}
                            setPendingIdFunction={setPendingRowId}
                        />
                    ),
                });
                setIsDrawerOpen(true);
            }}
        >
            {pendingRowId === gameId ? <Spinner /> : "Edit"}
        </Button>
    );
}
