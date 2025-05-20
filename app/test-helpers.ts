import { User } from "@supabase/supabase-js";
import { Database } from "database.types";

export const mockPublicUserRow: Database["public"]["Tables"]["users"]["Row"] = {
    user_id: "user1",
    username: "testuser",
    full_name: "Test User",
    email: "testuser@example.com",
    access_level: 2,
    avatar_url: "https://example.com/avatar.png",
    timezone: "America/New_York",
    created_at: "2024-06-01T12:00:00Z",
    updated_at: "2024-06-01T12:00:00Z",
};
export const mockPublicGameRow: Database["public"]["Tables"]["games"]["Row"] = {
    id: 111,
    host_user_id: "user1",
    share_code: "yikes",
    num_static_ai: 2,
    seconds_per_pre: 32,
    seconds_per_rank: 31,
    created_at: "2024-06-01T12:00:00Z",
    updated_at: "2024-06-01T12:00:00Z",
};
export const mockPublicQuestionRow: Database["public"]["Tables"]["questions"]["Row"] =
    {
        id: 292,
        pre_question: "What is your name?",
        rank_prompt: "Rank these names based on whatever you like.",
        created_at: "2024-06-01T12:00:00Z",
        updated_at: "2024-06-01T12:00:00Z",
    };
export const mockAuthUserRow: User = {
    id: "123",
    email: "test@example.com",
    user_metadata: {
        full_name: "Test User",
        avatar_url: "url1",
    },
    app_metadata: {},
    aud: "test-aud",
    created_at: "2024-06-01T12:00:00Z",
};

export const mockAllUsers: Database["public"]["Tables"]["users"]["Row"][] = [
    mockPublicUserRow,
    { ...mockPublicUserRow, user_id: "user2" },
];
export const mockGamesData: Database["public"]["Tables"]["games"]["Row"][] = [
    mockPublicGameRow,
    {
        ...mockPublicGameRow,
        id: 222,
        share_code: "XYZ789",
        host_user_id: "user2",
    },
];
export const mockQuestionsData: Database["public"]["Tables"]["questions"]["Row"][] =
    [mockPublicQuestionRow, { ...mockPublicQuestionRow, id: 373 }];
