"use server";

import { createClient } from "@/utils/supabase/server";

export const deleteQuestion = async (questionId: number) => {
    const supabase = await createClient();
    const { error, status } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

    if (error || status !== 204) {
        throw new Error();
    }
};
