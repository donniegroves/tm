import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { updateProfile } from "../actions/updateProfile";
import { TanstackProvider } from "../components/TanstackProvider";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

jest.mock("../actions/updateProfile", () => ({
    updateProfile: jest.fn(async () => undefined),
}));

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => ({
        setIsDrawerOpen: jest.fn(),
        setIsDrawerActionLoading: jest.fn(),
    }),
}));

describe("useUpdateProfile", () => {
    function useSetupCache() {
        const qc = useQueryClient();
        return qc;
    }

    it("invalidates the allUsers query on success", async () => {
        let qc: QueryClient | undefined;
        // Set up a dummy cache for allUsers
        const dummyUsers = [{ id: "u1", name: "User1" }];
        const { result } = renderHook(
            () => {
                qc = useSetupCache();
                React.useEffect(() => {
                    qc?.setQueryData(["allUsers"], dummyUsers);
                }, []);
                return useUpdateProfile();
            },
            { wrapper: TanstackProvider }
        );

        act(() => {
            result.current.mutate({ userId: "u1" });
        });
        await waitFor(() => result.current.isSuccess);

        expect(qc?.getQueryData(["allUsers"])).toEqual(dummyUsers);
        expect(updateProfile).toHaveBeenCalledWith({ userId: "u1" });
    });
});
