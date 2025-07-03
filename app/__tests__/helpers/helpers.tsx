import { User } from "@supabase/supabase-js";
import { Database } from "database.types";

export const mockAuthUserRow: User = {
    id: "mock-uuid-1",
    aud: "authenticated",
    role: "authenticated",
    email: "mockuser-1@example.com",
    email_confirmed_at: "2025-05-19T01:56:28.49964Z",
    phone: "",
    confirmed_at: "2025-05-19T01:56:28.49964Z",
    last_sign_in_at: "2025-05-27T17:54:34.905577Z",
    app_metadata: {
        provider: "google",
        providers: ["google"],
    },
    user_metadata: {
        avatar_url: "https://example.com/avatar.png",
        email: "mockuser-1@example.com",
        email_verified: true,
        full_name: "John Smith",
        iss: "https://accounts.example.com",
        name: "John Smith",
        phone_verified: false,
        picture: "https://example.com/avatar.png",
        provider_id: "provider-id-1",
        sub: "provider-id-1",
    },
    identities: [
        {
            identity_id: "mock-identity-id-1",
            id: "provider-id-1",
            user_id: "mock-uuid-1",
            identity_data: {
                avatar_url: "https://example.com/avatar.png",
                email: "mockuser-1@example.com",
                email_verified: true,
                full_name: "John Smith",
                iss: "https://accounts.example.com",
                name: "John Smith",
                phone_verified: false,
                picture: "https://example.com/avatar.png",
                provider_id: "provider-id-1",
                sub: "provider-id-1",
            },
            provider: "google",
            last_sign_in_at: "2025-05-19T01:56:28.492241Z",
            created_at: "2025-05-19T01:56:28.492291Z",
            updated_at: "2025-05-27T17:54:34.892342Z",
            // email here does not match User type, but does get included in the response
            // email: "johnsmith@example.com",
        },
    ],
    created_at: "2025-05-19T01:56:28.486826Z",
    updated_at: "2025-05-30T00:06:33.293563Z",
    is_anonymous: false,
};
export const mockPublicUserRow: Database["public"]["Tables"]["users"]["Row"] = {
    user_id: "user1",
    username: "testuser1",
    full_name: "Test User 1",
    email: "testuser1@example.com",
    access_level: 2,
    avatar_url: "https://example.com/avatar1.png",
    timezone: "America/New_York",
    created_at: "2024-06-01T12:00:00Z",
    updated_at: "2024-06-01T12:00:00Z",
};
export const mockPublicGameRow: Database["public"]["Tables"]["games"]["Row"] = {
    id: 111,
    host_user_id: "user1",
    share_code: "yikes",
    num_static_ai: 1,
    seconds_per_pre: 30,
    seconds_per_rank: 60,
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

export const mockAllUsers: Database["public"]["Tables"]["users"]["Row"][] = [
    mockPublicUserRow,
    {
        ...mockPublicUserRow,
        user_id: "user2",
        username: "testuser2",
        full_name: "Test User 2",
        email: "testuser2@example.com",
        avatar_url: "https://example.com/avatar2.png",
        timezone: "America/Los_Angeles",
    },
    {
        ...mockPublicUserRow,
        user_id: "user3",
        username: "testuser3",
        full_name: "Test User 3",
        email: "testuser3@example.com",
        avatar_url: null,
        timezone: "America/Los_Angeles",
    },
    {
        ...mockPublicUserRow,
        user_id: "user4",
        username: null,
        full_name: null,
        email: "testuser4@example.com",
        avatar_url: null,
        timezone: null,
    },
];
export const mockGamesData: Database["public"]["Tables"]["games"]["Row"][] = [
    mockPublicGameRow,
    {
        ...mockPublicGameRow,
        id: 222,
        seconds_per_pre: 90,
        seconds_per_rank: 90,
        share_code: "XYZXYZ",
        host_user_id: mockAllUsers[1].user_id,
        num_static_ai: 3,
    },
    {
        ...mockPublicGameRow,
        id: 333,
        seconds_per_pre: 30,
        seconds_per_rank: 30,
        share_code: "ABCABC",
        host_user_id: null,
        num_static_ai: 2,
    },
];
export const mockQuestionsData: Database["public"]["Tables"]["questions"]["Row"][] =
    [mockPublicQuestionRow, { ...mockPublicQuestionRow, id: 373 }];

export const mockGameUsersData: Database["public"]["Tables"]["game_users"]["Row"][] =
    [
        {
            user_id: mockAllUsers[2].user_id,
            game_id: mockGamesData[1].id,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        },
    ];

export const defaultInsideContext = {
    loggedInUserId: mockPublicUserRow.user_id,
    allUsers: mockAllUsers,
    games: mockGamesData,
    questions: mockQuestionsData,
    gameUsers: mockGameUsersData,
};
