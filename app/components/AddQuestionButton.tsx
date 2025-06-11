"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { JSX } from "react";
import { useDrawer } from "../inside/DrawerProvider";
import AddQuestionForm from "./AddQuestionForm";
import DrawerFooter, { DrawerFooterPurpose } from "./DrawerFooter";

export default function AddQuestionButton() {
    const {
        setIsDrawerOpen,
        setDrawerContent,
        isDrawerOpen,
        isDrawerActionLoading,
        drawerContent,
    } = useDrawer();

    const addQuestionHeader = (
        <div className="text-lg font-bold">Add a question</div>
    );

    const currentDrawerHeader = drawerContent.header as JSX.Element;
    const currentDrawerHeaderText =
        currentDrawerHeader.props.children.toString();
    const addQuestionHeaderText = addQuestionHeader.props.children.toString();

    const isAddQuestionHeader =
        isDrawerOpen && currentDrawerHeaderText === addQuestionHeaderText;

    return (
        <Button
            onPress={() => {
                setDrawerContent({
                    header: addQuestionHeader,
                    body: <AddQuestionForm />,
                    footer: (
                        <DrawerFooter
                            purpose={DrawerFooterPurpose.AddQuestion}
                        />
                    ),
                });
                setIsDrawerOpen(true);
            }}
        >
            {isAddQuestionHeader ||
            (isDrawerActionLoading && isAddQuestionHeader) ? (
                <Spinner />
            ) : (
                <div>Add question</div>
            )}
        </Button>
    );
}
