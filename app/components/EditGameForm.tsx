"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectedItems, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";
import { Database } from "database.types";
import { ChangeEventHandler, Key, useState } from "react";
import { useInsideContext } from "../inside/InsideContext";
import GenerateShareCodeButton from "./GenerateShareCodeButton";
import {
    getUserFromAllUsers,
    getFullNameStringFromUser,
    getAvatarUrlFromUser,
} from "../helpers";

export default function EditGameForm({ gameId }: { gameId: number }) {
    const { allUsers, games, gameUsers } = useInsideContext();

    const initialGame = games.find((g) => g.id === gameId);
    const initialGameInvitees = gameUsers
        .filter((gu) => gu.game_id === gameId)
        .map((gu) => gu.user_id);

    const [selectedHostUser, setSelectedHostUser] = useState<
        Database["public"]["Tables"]["users"]["Row"]["user_id"] | null
    >(initialGame?.host_user_id ?? null);
    const [selectedInvitees, setSelectedInvitees] =
        useState<Database["public"]["Tables"]["users"]["Row"]["user_id"][]>(
            initialGameInvitees
        );
    const [shareCode, setShareCode] = useState(initialGame?.share_code ?? "");
    const [numStaticAi, setNumStaticAi] = useState(
        initialGame?.num_static_ai ?? 0
    );
    const [secondsPerQuestion, setSecondsPerQuestion] = useState(
        initialGame?.seconds_per_pre ?? 30
    );
    const [secondsPerRanking, setSecondsPerRanking] = useState(
        initialGame?.seconds_per_rank ?? 60
    );

    if (!initialGame) {
        return <div>Game not found.</div>;
    }

    const onHostSelectionChange = (key: Key | null): void => {
        if (key) {
            setSelectedHostUser(key as string);
        }
    };
    const onInviteeSelectionChange: ChangeEventHandler<HTMLSelectElement> = (
        e
    ) => {
        const selectedOptions = e.target.value
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id.length > 0);
        setSelectedInvitees(selectedOptions);
    };
    const onAiBotsSelectionChange = (key: SharedSelection): void => {
        if (key.currentKey) {
            setNumStaticAi(parseInt(key.currentKey, 10));
        }
    };
    const onSecondsPerQuestionChange = (key: SharedSelection): void => {
        if (key.currentKey) {
            setSecondsPerQuestion(parseInt(key.currentKey, 10));
        }
    };
    const onSecondsPerRankingChange = (key: SharedSelection): void => {
        if (key.currentKey) {
            setSecondsPerRanking(parseInt(key.currentKey, 10));
        }
    };

    return (
        <form id="edit-game-form" role="form" className="flex flex-col gap-4">
            <Input
                type="hidden"
                id="game-id-input"
                value={gameId.toString()}
                aria-hidden="true"
            />
            <Input
                type="hidden"
                id="host-input"
                value={selectedHostUser ?? ""}
                aria-hidden="true"
            />
            <Input
                type="hidden"
                id="invitees-input"
                value={selectedInvitees.join(",")}
                aria-hidden="true"
            />
            <Input
                type="hidden"
                id="share-code-input"
                value={shareCode}
                aria-hidden="true"
            />
            <Input
                type="hidden"
                id="ai-bots-input"
                value={numStaticAi.toString()}
                aria-hidden="true"
            />
            <Input
                type="hidden"
                id="question-duration-input"
                value={secondsPerQuestion.toString()}
                aria-hidden="true"
            />
            <Input
                type="hidden"
                id="ranking-duration-input"
                value={secondsPerRanking.toString()}
                aria-hidden="true"
            />
            <Autocomplete
                selectorButtonProps={{
                    "aria-label": "Host dropdown button",
                }}
                inputProps={{
                    startContent: (
                        <>
                            {selectedHostUser && (
                                <>
                                    <Avatar
                                        alt={getFullNameStringFromUser(
                                            getUserFromAllUsers(
                                                { user_id: selectedHostUser },
                                                allUsers
                                            )
                                        )}
                                        className="flex-shrink-0 mr-1 max-w-7 max-h-7"
                                        size="sm"
                                        src={getAvatarUrlFromUser(
                                            getUserFromAllUsers(
                                                { user_id: selectedHostUser },
                                                allUsers
                                            )
                                        )}
                                    />
                                </>
                            )}
                        </>
                    ),
                }}
                items={allUsers}
                label="Host"
                labelPlacement="outside"
                placeholder="Select host"
                description="Choose a host to run the game."
                variant="faded"
                selectedKey={selectedHostUser}
                onSelectionChange={onHostSelectionChange}
            >
                {(user) => (
                    <AutocompleteItem
                        key={user.user_id}
                        textValue={getFullNameStringFromUser(user)}
                    >
                        <div className="flex gap-2 items-center">
                            <Avatar
                                alt={getFullNameStringFromUser(user)}
                                className="flex-shrink-0"
                                size="sm"
                                src={getAvatarUrlFromUser(user)}
                            />
                            <div className="flex flex-col">
                                <span className="text-small">
                                    {getFullNameStringFromUser(user)}
                                </span>
                                <span className="text-tiny text-default-400">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </AutocompleteItem>
                )}
            </Autocomplete>
            <Select
                id="edit-game-invitees-input"
                isMultiline
                items={allUsers}
                label="Invitees"
                labelPlacement="inside"
                placeholder="Select a user"
                renderValue={(
                    items: SelectedItems<
                        Database["public"]["Tables"]["users"]["Row"]
                    >
                ) => {
                    return (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <Chip
                                    key={item.data?.user_id}
                                    role="button"
                                    aria-label={`Invitee: ${
                                        item.data?.full_name ?? ""
                                    }`}
                                >
                                    {item.data?.full_name ?? ""}
                                </Chip>
                            ))}
                        </div>
                    );
                }}
                selectionMode="multiple"
                onChange={onInviteeSelectionChange}
                defaultSelectedKeys={selectedInvitees}
                variant="bordered"
            >
                {(user) => (
                    <SelectItem
                        key={user.user_id}
                        textValue={user.full_name ?? ""}
                    >
                        <div className="flex gap-2 items-center">
                            <Avatar
                                alt={user.full_name ?? ""}
                                className="flex-shrink-0"
                                size="sm"
                                src={user.avatar_url ?? ""}
                            />
                            <div className="flex flex-col">
                                <span className="text-small">
                                    {user.full_name ?? ""}
                                </span>
                                <span className="text-tiny text-default-400">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </SelectItem>
                )}
            </Select>
            <div className="flex flex-row gap-2">
                <Input
                    value={shareCode}
                    id="edit-game-share-code-input"
                    label="Share Code"
                    placeholder="Enter share code"
                    maxLength={6}
                    onChange={(e) => {
                        const upper = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z]/g, "");
                        setShareCode(upper);
                    }}
                />
                <GenerateShareCodeButton codeSetter={setShareCode} />
            </div>

            <div className="w-1/2">
                <Select
                    className="pr-2"
                    id="edit-game-aibots-select"
                    label="Number of AI Bots"
                    placeholder="Select number of AI bots"
                    defaultSelectedKeys={[initialGame.num_static_ai.toString()]}
                    items={[
                        { key: "0", label: "0" },
                        { key: "1", label: "1" },
                        { key: "2", label: "2" },
                        { key: "3", label: "3" },
                    ]}
                    onSelectionChange={onAiBotsSelectionChange}
                >
                    {(item) => <SelectItem>{item.label}</SelectItem>}
                </Select>
            </div>

            <div className="flex flex-row gap-4">
                <Select
                    id="edit-game-seconds-per-question-select"
                    label="Seconds per question"
                    placeholder="Select seconds per question"
                    defaultSelectedKeys={[
                        initialGame.seconds_per_pre.toString(),
                    ]}
                    items={[
                        { key: "30", label: "30" },
                        { key: "60", label: "60" },
                        { key: "90", label: "90" },
                    ]}
                    onSelectionChange={onSecondsPerQuestionChange}
                >
                    {(item) => <SelectItem>{item.label}</SelectItem>}
                </Select>
                <Select
                    id="edit-game-seconds-per-ranking-select"
                    label="Seconds per ranking"
                    placeholder="Select seconds per ranking"
                    defaultSelectedKeys={[
                        initialGame.seconds_per_rank.toString(),
                    ]}
                    items={[
                        { key: "30", label: "30" },
                        { key: "60", label: "60" },
                        { key: "90", label: "90" },
                    ]}
                    onSelectionChange={onSecondsPerRankingChange}
                >
                    {(item) => <SelectItem>{item.label}</SelectItem>}
                </Select>
            </div>
        </form>
    );
}
