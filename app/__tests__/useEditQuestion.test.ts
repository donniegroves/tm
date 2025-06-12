import { act, renderHook, waitFor } from "@testing-library/react";
import { editQuestion } from "../actions/editQuestion";
import { TanstackProvider } from "../components/TanstackProvider";
import { useEditQuestion } from "../hooks/useEditQuestion";

jest.mock("../actions/editQuestion", () => ({
    editQuestion: jest.fn(async ({ questionId }) => {
        if (questionId === -1) throw new Error("fail");
        return undefined;
    }),
}));

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => {
    const actual = jest.requireActual("@tanstack/react-query");
    return {
        ...actual,
        useQueryClient: () => ({
            invalidateQueries: mockInvalidateQueries,
        }),
    };
});

describe("useEditQuestion", () => {
    it("edits a question and invalidates questions query", async () => {
        const { result } = renderHook(() => useEditQuestion(), {
            wrapper: TanstackProvider,
        });

        act(() => {
            result.current.mutate();
        });

        await waitFor(() => {
            expect(editQuestion).toHaveBeenCalled();
            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ["questions"],
            });
        });
    });
});
