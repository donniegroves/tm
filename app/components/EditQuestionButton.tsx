import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Dispatch, SetStateAction } from "react";
import { useDrawer } from "../inside/DrawerProvider";
import DrawerFooter, { DrawerFooterPurpose } from "./DrawerFooter";
import EditQuestionForm from "./EditQuestionForm";

export default function EditQuestionButton({
    questionId,
    pendingRowId,
    setPendingRowId,
}: {
    questionId: number;
    pendingRowId: number;
    setPendingRowId: Dispatch<SetStateAction<number>>;
}) {
    const { setIsDrawerOpen, setDrawerContent } = useDrawer();

    const editQuestionHeader = (
        <div className="text-lg font-bold">Edit question</div>
    );

    return (
        <Button
            onPress={async () => {
                setPendingRowId(questionId);
                setDrawerContent({
                    header: editQuestionHeader,
                    body: <EditQuestionForm questionId={questionId} />,
                    footer: (
                        <DrawerFooter
                            purpose={DrawerFooterPurpose.EditQuestion}
                            setPendingIdFunction={setPendingRowId}
                        />
                    ),
                });
                setIsDrawerOpen(true);
            }}
        >
            {pendingRowId === questionId ? <Spinner /> : "Edit"}
        </Button>
    );
}
