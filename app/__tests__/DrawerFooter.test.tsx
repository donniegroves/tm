import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DrawerFooter, { DrawerFooterPurpose } from "../components/DrawerFooter";
import {
    mockUseDrawer,
    setMockUseDrawer,
} from "./helpers/helper-DrawerContext";
import {
    mockUseInsideContext,
    setMockInsideContext,
} from "./helpers/helper-InsideContext";
import { mockUseMutation, setMockUseMutation } from "./helpers/helper-Mutation";
import { mockUseQueryClient } from "./helpers/helper-QueryClient";

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => mockUseInsideContext(),
}));
jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => mockUseDrawer(),
}));
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    useQueryClient: () => mockUseQueryClient(),
    useMutation: () => mockUseMutation(),
}));

describe("DrawerFooter", () => {
    afterEach(() => {
        setMockInsideContext({});
        setMockUseDrawer({});
        setMockUseMutation({});
    });

    it("renders nothing for non-profile-update purposes", () => {
        setMockInsideContext({ loggedInUserId: 755 });
        setMockUseDrawer({ isDrawerOpen: true });

        const { container } = render(
            <DrawerFooter purpose={DrawerFooterPurpose.Reserved} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("renders close and save button for profile-update purpose", async () => {
        render(<DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />);

        screen.getByRole("button", { name: "Close" });
        screen.getByRole("button", { name: "Save" });
    });

    it("renders close and add button for add-question purpose", async () => {
        const mockMutate = jest.fn();
        setMockUseMutation({
            mutateAsync: mockMutate,
        });
        const whenDoneFunction = jest.fn();
        render(
            <DrawerFooter
                purpose={DrawerFooterPurpose.AddQuestion}
                whenDoneFunction={whenDoneFunction}
            />
        );

        screen.getByRole("button", { name: "Close" });
        const addButton = screen.getByRole("button", { name: "Add" });

        await waitFor(() => {
            fireEvent.click(addButton);
        });
        expect(mockMutate).toHaveBeenCalled();
        expect(whenDoneFunction).toHaveBeenCalled();
    });

    it("renders close and edit button for edit-question purpose", async () => {
        const mockMutate = jest.fn();
        setMockUseMutation({
            mutateAsync: mockMutate,
        });
        const whenDoneFunction = jest.fn();
        const setPendingIdFunction = jest.fn();
        render(
            <DrawerFooter
                purpose={DrawerFooterPurpose.EditQuestion}
                setPendingIdFunction={setPendingIdFunction}
                whenDoneFunction={whenDoneFunction}
            />
        );

        screen.getByRole("button", { name: "Close" });
        const editButton = screen.getByRole("button", { name: "Save" });

        await waitFor(() => {
            fireEvent.click(editButton);
        });
        expect(mockMutate).toHaveBeenCalled();
        expect(whenDoneFunction).toHaveBeenCalled();
        expect(setPendingIdFunction).toHaveBeenCalledWith(-1);
    });

    it("calls queryClient.invalidateQueries on successful profile update", async () => {
        const mockMutate = jest.fn();

        setMockUseMutation({
            mutateAsync: mockMutate,
        });

        const mockWhenDoneFunction = jest.fn();

        render(
            <DrawerFooter
                purpose={DrawerFooterPurpose.ProfileUpdate}
                whenDoneFunction={mockWhenDoneFunction}
            />
        );
        const saveButton = screen.getByRole("button", { name: "Save" });

        await waitFor(() => fireEvent.click(saveButton));
        expect(mockMutate).toHaveBeenCalled();
        expect(mockMutate).toHaveBeenCalledWith({
            userId: "user1",
        });
        expect(mockWhenDoneFunction).toHaveBeenCalled();
    });

    it("loads spinner when isDrawerActionLoading is true", async () => {
        setMockUseDrawer({ isDrawerActionLoading: true });
        render(<DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />);
        const saveButton = screen.getByRole("button", { name: "Loading..." });
        expect(saveButton).toBeInTheDocument();
    });

    it("calls setIsDrawerOpen(false) when Close is pressed for profile-update", async () => {
        const setIsDrawerOpen = jest.fn();
        setMockUseDrawer({ setIsDrawerOpen });
        render(<DrawerFooter purpose={DrawerFooterPurpose.ProfileUpdate} />);

        const closeButton = screen.getByRole("button", { name: "Close" });
        const saveButton = screen.getByRole("button", { name: "Save" });

        await waitFor(() => {
            expect(closeButton).toBeInTheDocument();
            expect(saveButton).toBeInTheDocument();
        });

        fireEvent.click(closeButton);
        await waitFor(() => {
            expect(setIsDrawerOpen).toHaveBeenCalledWith(false);
        });
    });
});
