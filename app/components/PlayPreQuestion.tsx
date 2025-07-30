"use client";

import { useIsMaster } from "../hooks/useIsMaster";
import PlayAnswerQuestionForm from "./PlayAnswerQuestionForm";

export default function PlayPreQuestion() {
    const { loggedInUserIsMaster } = useIsMaster();

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">PreQuestion time!</h1>
            <div className="relative border border-gray-300 w-[400px] h-[300px]">
                {loggedInUserIsMaster && <div>You are the master!</div>}
                {!loggedInUserIsMaster && <PlayAnswerQuestionForm />}
            </div>
        </div>
    );
}
