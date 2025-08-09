"use client";

import { useEffect, useRef } from "react";
import { useIsMaster } from "../hooks/useIsMaster";
import { useInsideContext } from "../inside/InsideContext";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";
import { Cursor, UpDownArrowSvg } from "./IconSvg";
import Ranker from "./Ranker";

export default function PlayCanvas() {
    const { channel, cursor } = useRealtimeContext();
    const { preAnswers } = useInsideContext();
    const { loggedInUserIsMaster } = useIsMaster();

    const pendingPositionRef = useRef<{ x: number; y: number } | null>(null);
    const lastSentTimeRef = useRef<number>(0);
    const debounceDelay = 75;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!loggedInUserIsMaster) return;

        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        pendingPositionRef.current = { x, y };

        // Send immediately if enough time has passed
        const now = Date.now();
        if (now - lastSentTimeRef.current >= debounceDelay) {
            if (channel && pendingPositionRef.current) {
                channel.send({
                    type: "broadcast",
                    event: "cursor-pos",
                    payload: pendingPositionRef.current,
                });
                lastSentTimeRef.current = now;
                pendingPositionRef.current = null;
            }
        }
    };

    useEffect(() => {
        if (!channel) return;

        const interval = setInterval(() => {
            if (pendingPositionRef.current) {
                channel.send({
                    type: "broadcast",
                    event: "cursor-pos",
                    payload: pendingPositionRef.current,
                });
                pendingPositionRef.current = null;
            }
        }, debounceDelay);

        return () => clearInterval(interval);
    }, [channel]);

    function calculateMaxHeight(preAnswers: any[]) {
        const baseHeight = 65;
        return preAnswers.length * baseHeight + (preAnswers.length - 1) * 2;
    }
    const maxHeight = calculateMaxHeight(preAnswers);

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-row">
                <div
                    className="flex flex-col items-center justify-between mr-6 mt-12"
                    style={{ maxHeight: `${maxHeight}px` }}
                >
                    <div className="mb-2 text-sm font-semibold">
                        Best goes here
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <UpDownArrowSvg
                            size={72 * ((preAnswers.length * 1.25) / 3)}
                        />
                    </div>
                    <div className="mt-2 text-sm font-semibold">
                        Worst goes here
                    </div>
                </div>
                <div className="flex flex-row">
                    <div
                        className="relative w-[400px]"
                        onMouseMove={handleMouseMove}
                    >
                        <h1 className="text-2xl text-center font-bold mb-4 h-8">
                            Rank time!
                        </h1>
                        <Ranker preAnswers={preAnswers} />
                        {!loggedInUserIsMaster && cursor && (
                            <div
                                className="absolute pointer-events-none z-10"
                                style={{
                                    left: cursor.x,
                                    top: cursor.y,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <Cursor size={20} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
