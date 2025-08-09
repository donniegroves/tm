"use client";

import { Avatar } from "@heroui/avatar";
import { useState } from "react";
import { useInsideContext } from "../inside/InsideContext";
import { DownArrow2Svg, UpArrow2Svg } from "./IconSvg";
import { RatedPreAnswer } from "./Ranker";

export default function RateableAnswer({
    ratedPreAnswer,
    allRatedPreAnswers,
    setRatedPreAnswers,
}: {
    ratedPreAnswer: RatedPreAnswer;
    allRatedPreAnswers: RatedPreAnswer[];
    setRatedPreAnswers: React.Dispatch<React.SetStateAction<RatedPreAnswer[]>>;
}) {
    const { allUsers } = useInsideContext();
    const [isAnimating, setIsAnimating] = useState(false);
    const handleRankingChange = (direction: "up" | "down") => {
        const currentRating = ratedPreAnswer.rating;
        const targetRating =
            direction === "up" ? currentRating + 1 : currentRating - 1;

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);

        setRatedPreAnswers((prev) => {
            const answerWithTargetRating = prev.find(
                (item) => item.rating === targetRating
            );

            return prev.map((item) => {
                if (
                    item.user_id === ratedPreAnswer.user_id &&
                    item.game_id === ratedPreAnswer.game_id &&
                    item.question_id === ratedPreAnswer.question_id
                ) {
                    return { ...item, rating: targetRating };
                }

                if (
                    answerWithTargetRating &&
                    item.user_id === answerWithTargetRating.user_id &&
                    item.game_id === answerWithTargetRating.game_id &&
                    item.question_id === answerWithTargetRating.question_id
                ) {
                    return { ...item, rating: currentRating };
                }

                return item;
            });
        });
    };

    const shouldHideUpArrow =
        ratedPreAnswer.rating === allRatedPreAnswers.length;
    const shouldHideDownArrow = ratedPreAnswer.rating === 1;

    return (
        <div
            className={`flex flex-row items-center space-x-2 p-2 border rounded transition-all duration-300 ease-in-out ${
                isAnimating ? "transform scale-105" : "transform"
            }`}
        >
            <div className="min-w-12">
                {!shouldHideUpArrow && (
                    <button
                        className="px-2 py-1 disabled:opacity-50 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95"
                        onClick={() => handleRankingChange("up")}
                        disabled={
                            ratedPreAnswer.rating === allRatedPreAnswers.length
                        }
                    >
                        <UpArrow2Svg className="text-customlight" size={32} />
                    </button>
                )}
            </div>
            <div
                className={`flex flex-row justify-center items-center space-x-2 min-w-0 flex-1 text-center transition-all duration-300 ${
                    isAnimating ? "font-semibold text-white" : ""
                }`}
            >
                <div className="flex items-center justify-center">
                    {ratedPreAnswer.answer}
                </div>
                <Avatar
                    size="sm"
                    src={
                        allUsers.find(
                            (user) => user.user_id === ratedPreAnswer.user_id
                        )?.avatar_url ?? ""
                    }
                />
            </div>
            <div className="min-w-12">
                {!shouldHideDownArrow && (
                    <button
                        className="px-2 py-1 disabled:opacity-50 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95"
                        onClick={() => handleRankingChange("down")}
                        disabled={ratedPreAnswer.rating === 1}
                    >
                        <DownArrow2Svg className="text-customlight" size={32} />
                    </button>
                )}
            </div>
        </div>
    );
}
