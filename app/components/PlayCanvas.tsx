"use client";

import { MustacheSvg } from "@/app/components/IconSvg";
import { useEffect, useRef } from "react";
import { useRealtimeContext } from "../play/[share_code]/RealtimeContext";

export default function PlayCanvas() {
    const { channel, cursor } = useRealtimeContext();

    const pendingPositionRef = useRef<{ x: number; y: number } | null>(null);
    const lastSentTimeRef = useRef<number>(0);
    const debounceDelay = 75;

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
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

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Game in progress</h1>
            <div className="relative border border-gray-300 w-[400px] h-[300px]">
                <canvas
                    role="img"
                    width={400}
                    height={300}
                    className="absolute left-0 top-0 z-0 w-[400px] h-[300px]"
                    onMouseMove={handleMouseMove}
                />
                {cursor && (
                    <div
                        className="absolute pointer-events-none z-10"
                        style={{
                            left: cursor.x,
                            top: cursor.y,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <MustacheSvg size={32} />
                    </div>
                )}
            </div>
        </div>
    );
}
