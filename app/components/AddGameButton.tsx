"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { JSX } from "react";
import { useDrawer } from "../inside/DrawerProvider";
import AddGameForm from "./AddGameForm";
import DrawerFooter, { DrawerFooterPurpose } from "./DrawerFooter";

export default function AddGameButton() {
    const {
        setIsDrawerOpen,
        setDrawerContent,
        isDrawerOpen,
        drawerContent,
    } = useDrawer();

    const addGameHeader = <div className="text-lg font-bold">Add a game</div>;

    const currentDrawerHeader = drawerContent.header as JSX.Element;
    const currentDrawerHeaderText =
        currentDrawerHeader?.props.children.toString();
    const addGameHeaderText = addGameHeader.props.children.toString();

    const pendingGameAdd =
        isDrawerOpen && currentDrawerHeaderText === addGameHeaderText;

    return (
        <Button
            onPress={() => {
                setDrawerContent({
                    header: addGameHeader,
                    body: <AddGameForm />,
                    footer: (
                        <DrawerFooter purpose={DrawerFooterPurpose.AddGame} />
                    ),
                });
                setIsDrawerOpen(true);
            }}
        >
            {pendingGameAdd ? (
                <Spinner />
            ) : (
                <div>Add game</div>
            )}
        </Button>
    );
}
