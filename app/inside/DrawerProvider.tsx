"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type DrawerContent = {
    header: ReactNode | null;
    body: ReactNode | null;
    footer: ReactNode | null;
};

const DrawerContext = createContext<
    | {
          isDrawerOpen: boolean;
          setIsDrawerOpen: (open: boolean) => void;
          drawerContent: DrawerContent;
          setDrawerContent: (content: DrawerContent) => void;
      }
    | undefined
>(undefined);

export function useDrawer() {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error("useDrawer must be used within DrawerContext");
    return ctx;
}

export default function DrawerProvider({ children }: { children: ReactNode }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerContent, setDrawerContent] = useState<DrawerContent>({
        header: null,
        body: null,
        footer: null,
    });

    return (
        <DrawerContext.Provider
            value={{
                isDrawerOpen,
                setIsDrawerOpen,
                drawerContent,
                setDrawerContent,
            }}
        >
            {children}
        </DrawerContext.Provider>
    );
}
