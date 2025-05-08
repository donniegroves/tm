"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import { signOut } from "../actions/signOut";

export default function SignOutButton() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button
            className="bg-customlight text-customdark hover:bg-customlight/50 hover:text-customdark"
            onPress={async () => {
                setIsLoading(true);
                await signOut();
                setIsLoading(false);
            }}
            disabled={isLoading}
        >
            {isLoading ? <span className="spinner" /> : "Sign Out"}
        </Button>
    );
}
