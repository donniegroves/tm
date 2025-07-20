"use client";

import PlayStageContent from "./PlayStageContent";
import { RealtimeProvider } from "./RealtimeContext";

export default function PlayStage() {
    return (
        <RealtimeProvider>
            <PlayStageContent />
        </RealtimeProvider>
    );
}
