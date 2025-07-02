import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import QuestionsTable from "../components/QuestionsTable";
import { mockUseDrawer } from "./helpers/helper-DrawerContext";
import { mockPublicQuestionRow } from "./helpers/helpers";

jest.mock("../inside/DrawerProvider", () => ({
    useDrawer: () => mockUseDrawer(),
}));
jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({
        getQueryState: jest.fn(() => ({
            fetchStatus: "idle",
        })),
    }),
}));

jest.mock("../hooks/useDeleteQuestion", () => ({
    useDeleteQuestion: () => ({
        variables: { questionId: 456 },
        mutateAsync: jest.fn(),
    }),
}));
jest.mock("../hooks/useEditQuestion", () => ({
    useEditQuestion: () => ({
        variables: { questionId: 456 },
        mutateAsync: jest.fn(),
    }),
}));

jest.mock("../components/AddQuestionButton", () => {
    const MockAddQuestionButton = () => (
        <button>Fake add question button</button>
    );
    MockAddQuestionButton.displayName = "MockAddQuestionButton";
    return MockAddQuestionButton;
});

jest.mock("../inside/InsideContext", () => ({
    useInsideContext: () => ({
        questions: [
            mockPublicQuestionRow,
            {
                ...mockPublicQuestionRow,
                id: 456,
                pre_question: "What is your quest?",
            },
        ],
    }),
}));

describe("QuestionsTable", () => {
    it("renders questions in the table", () => {
        render(<QuestionsTable />);
        expect(screen.getByText("What is your name?")).toBeInTheDocument();
        expect(screen.getByText("What is your quest?")).toBeInTheDocument();
        expect(screen.getByText("Questions")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Fake add question button" })
        ).toBeInTheDocument();
        expect(screen.getAllByRole("row").length).toBe(3);
        expect(screen.getAllByText("Delete").length).toBe(2);
        expect(screen.getAllByText("Edit").length).toBe(2);
    });
    it("row is blurred when question is being deleted", async () => {
        render(<QuestionsTable />);
        const deleteButton = screen.getAllByText("Delete")[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const blurredRow = screen
                .getAllByRole("row")
                .find((row) => row.classList.contains("blur-xs"));
            expect(blurredRow).toBeInTheDocument();
            expect(blurredRow).toHaveAttribute("data-key", "292");
        });
    });
    it("row is blurred when question is being edited", async () => {
        render(<QuestionsTable />);
        const editButton = screen.getAllByText("Edit")[1];
        fireEvent.click(editButton);

        await waitFor(() => {
            const blurredRow = screen
                .getAllByRole("row")
                .find((row) => row.classList.contains("blur-xs"));
            expect(blurredRow).toBeInTheDocument();
            expect(blurredRow).toHaveAttribute("data-key", "456");
        });
    });
});
