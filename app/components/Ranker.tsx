"use client";

import { Button } from "@heroui/button";
import { Database } from "database.types";
import { useState } from "react";
import RateableAnswer from "./RateableAnswer";
export type RatedPreAnswer =
    Database["public"]["Tables"]["pre_answers"]["Row"] & {
        rating: number;
    };

export default function Ranker({
    preAnswers,
}: {
    preAnswers: Database["public"]["Tables"]["pre_answers"]["Row"][];
}) {
    const [ratedPreAnswers, setRatedPreAnswers] = useState<RatedPreAnswer[]>(
        () =>
            preAnswers.map((answer, index) => ({
                ...answer,
                rating: index + 1,
            }))
    );

    return (
        <div className="flex flex-col gap-2">
            {ratedPreAnswers
                .slice()
                .sort((a, b) => b.rating - a.rating)
                .map((ratedPreAnswer, index) => (
                    <RateableAnswer
                        key={`${ratedPreAnswer.game_id}-${ratedPreAnswer.question_id}-${ratedPreAnswer.user_id}`}
                        ratedPreAnswer={ratedPreAnswer}
                        allRatedPreAnswers={ratedPreAnswers}
                        setRatedPreAnswers={setRatedPreAnswers}
                    />
                ))}
            <div className="flex justify-center mt-4 h-16">
                <Button>Submit Rankings</Button>
            </div>
        </div>
    );
}
