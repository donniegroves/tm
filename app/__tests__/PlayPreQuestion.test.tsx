import { render, screen } from "@testing-library/react";
import PlayPreQuestion from "../components/PlayPreQuestion";
import { useIsMaster } from "../hooks/useIsMaster";
import { useUpdateGameStatus } from "../hooks/useUpdateGameStatus";
import { useLobbyHook } from "../play/[share_code]/useLobbyHook";
import { createWrapper } from "./helpers/createWrapper";
import { defaultRealtimeContextValues } from "./helpers/helpers";

jest.mock("../hooks/useIsMaster", () => ({
    useIsMaster: jest.fn(),
}));

jest.mock("../hooks/useUpdateGameStatus", () => ({
    useUpdateGameStatus: jest.fn(),
}));

jest.mock("../play/[share_code]/useLobbyHook", () => ({
    useLobbyHook: jest.fn(),
}));

jest.mock("../components/PlayAnswerQuestionForm", () => {
    return function MockPlayAnswerQuestionForm() {
        return <div>PlayAnswerQuestionForm Component</div>;
    };
});

const mockUseIsMaster = useIsMaster as jest.Mock;
const mockUseUpdateGameStatus = useUpdateGameStatus as jest.Mock;
const mockUseLobbyHook = useLobbyHook as jest.Mock;

describe("PlayPreQuestion", () => {
    const mockMutateAsync = jest.fn();
    const mockUpdateGameStatusMutation = {
        mutateAsync: mockMutateAsync,
        isIdle: true,
        isPending: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: false,
            currentMasterUserId: "test-master-id",
        });

        mockUseUpdateGameStatus.mockReturnValue(mockUpdateGameStatusMutation);

        mockUseLobbyHook.mockReturnValue({
            allAnswersSubmitted: false,
        });
    });

    it("renders the main heading", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: false,
            currentMasterUserId: "test-master-id",
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(screen.getByText("PreQuestion time!")).toBeInTheDocument();
    });

    it("shows master message when user is master", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUserId: "test-master-id",
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(screen.getByText("You are the master!")).toBeInTheDocument();
        expect(
            screen.queryByText("PlayAnswerQuestionForm Component")
        ).not.toBeInTheDocument();
    });

    it("shows PlayAnswerQuestionForm when user is not master", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: false,
            currentMasterUserId: "test-master-id",
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(
            screen.getByText("PlayAnswerQuestionForm Component")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("You are the master!")
        ).not.toBeInTheDocument();
    });

    it("shows game not found when no gameData", () => {
        render(<PlayPreQuestion />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                gameData: undefined,
            }),
        });

        expect(screen.getByText("Game not found.")).toBeInTheDocument();
    });

    it("shows game not found when no channel", () => {
        render(<PlayPreQuestion />, {
            wrapper: createWrapper(undefined, {
                ...defaultRealtimeContextValues,
                channel: null,
            }),
        });

        expect(screen.getByText("Game not found.")).toBeInTheDocument();
    });

    it("renders nothing when master and all answers submitted and mutation is idle", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUserId: "test-master-id",
        });

        mockUseLobbyHook.mockReturnValue({
            allAnswersSubmitted: true,
        });

        const { container } = render(<PlayPreQuestion />, {
            wrapper: createWrapper(),
        });

        expect(container.firstChild).toBeNull();
    });

    it("calls updateGameStatus when master and all answers submitted", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUserId: "test-master-id",
        });

        mockUseLobbyHook.mockReturnValue({
            allAnswersSubmitted: true,
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(mockMutateAsync).toHaveBeenCalledWith(
            {
                ...defaultRealtimeContextValues.gameData,
                status: defaultRealtimeContextValues.gameData!.status + 1,
            },
            {
                onSuccess: expect.any(Function),
            }
        );
    });

    it("sends game-status-changed broadcast on successful game status update", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUserId: "test-master-id",
        });

        mockUseLobbyHook.mockReturnValue({
            allAnswersSubmitted: true,
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        const mutateCall = mockMutateAsync.mock.calls[0];
        const mutateOptions = mutateCall[1];
        const onSuccessCallback = mutateOptions.onSuccess;

        onSuccessCallback();

        expect(defaultRealtimeContextValues.channel?.send).toHaveBeenCalledWith(
            {
                type: "broadcast",
                event: "game-status-changed",
            }
        );
    });

    it("does not call updateGameStatus when mutation is not idle", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUserId: "test-master-id",
        });

        mockUseLobbyHook.mockReturnValue({
            allAnswersSubmitted: true,
        });

        mockUseUpdateGameStatus.mockReturnValue({
            ...mockUpdateGameStatusMutation,
            isIdle: false,
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(mockMutateAsync).not.toHaveBeenCalled();
        expect(screen.getByText("PreQuestion time!")).toBeInTheDocument();
    });

    it("does not call updateGameStatus when not all answers submitted", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: true,
            currentMasterUserId: "test-master-id",
        });

        mockUseLobbyHook.mockReturnValue({
            allAnswersSubmitted: false,
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(mockMutateAsync).not.toHaveBeenCalled();
        expect(screen.getByText("PreQuestion time!")).toBeInTheDocument();
    });

    it("does not call updateGameStatus when user is not master", () => {
        mockUseIsMaster.mockReturnValue({
            loggedInUserIsMaster: false,
            currentMasterUserId: "test-master-id",
        });

        mockUseLobbyHook.mockReturnValue({
            allAnswersSubmitted: true,
        });

        render(<PlayPreQuestion />, { wrapper: createWrapper() });

        expect(mockMutateAsync).not.toHaveBeenCalled();
        expect(screen.getByText("PreQuestion time!")).toBeInTheDocument();
    });
});
