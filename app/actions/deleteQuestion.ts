"use client";

import { createClient } from "@/utils/supabase/client";

export const deleteQuestion = async ({
    questionId,
}: {
    questionId: number;
}) => {
    const supabase = createClient();
    const { error, status } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

    if (error || status !== 204) {
        throw new Error(
            error?.message || `Failed to delete question with id ${questionId}`
        );
    }
};
