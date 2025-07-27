import { getGameUserIdsInDeterministicOrder } from "../helpers";
import {
    mockAllUsers,
    mockGamesData,
    mockGameUsersData,
} from "./helpers/helpers";

describe("getGameUserIdsInDeterministicOrder", () => {
    const extendedMockGameUsersData = [
        ...mockGameUsersData,
        {
            user_id: mockAllUsers[1].user_id,
            game_id: mockGamesData[2].id,
            is_host: true,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        },
        {
            user_id: mockAllUsers[3].user_id,
            game_id: mockGamesData[2].id,
            is_host: false,
            created_at: "2024-06-01T12:00:00Z",
            updated_at: "2024-06-01T12:00:00Z",
        },
    ];
    it("returns all user IDs from the input array", () => {
        const result = getGameUserIdsInDeterministicOrder(
            extendedMockGameUsersData,
            mockGamesData[1].share_code
        );
        const expectedIds = extendedMockGameUsersData.map(
            (user) => user.user_id
        );

        expect(result).toHaveLength(expectedIds.length);
        expect(result.sort()).toEqual(expectedIds.sort());
    });

    it("returns deterministic results for the same seed", () => {
        const seed = mockGamesData[1].share_code;
        const result1 = getGameUserIdsInDeterministicOrder(
            extendedMockGameUsersData,
            seed
        );
        const result2 = getGameUserIdsInDeterministicOrder(
            extendedMockGameUsersData,
            seed
        );

        expect(result1).toEqual(result2);
    });

    it("returns different results for different seeds", () => {
        const result1 = getGameUserIdsInDeterministicOrder(
            extendedMockGameUsersData,
            mockGamesData[0].share_code
        );
        const result2 = getGameUserIdsInDeterministicOrder(
            extendedMockGameUsersData,
            mockGamesData[2].share_code
        );

        expect(result1).not.toEqual(result2);
        expect(result1.sort()).toEqual(result2.sort());
    });

    it("handles empty array", () => {
        const result = getGameUserIdsInDeterministicOrder(
            [],
            mockGamesData[0].share_code
        );
        expect(result).toEqual([]);
    });

    it("handles single user", () => {
        const singleUser = [extendedMockGameUsersData[0]];
        const result = getGameUserIdsInDeterministicOrder(
            singleUser,
            mockGamesData[1].share_code
        );

        expect(result).toEqual([singleUser[0].user_id]);
    });

    it("produces shuffled results (not always in original order)", () => {
        const originalOrder = extendedMockGameUsersData.map(
            (user) => user.user_id
        );
        let foundDifferentOrder = false;

        const seeds = [
            mockGamesData[0].share_code,
            mockGamesData[1].share_code,
            mockGamesData[2].share_code,
            ...Array.from(
                { length: 7 },
                (_, i) => `${mockGamesData[0].share_code}${i}`
            ),
        ];

        for (const seed of seeds) {
            const result = getGameUserIdsInDeterministicOrder(
                extendedMockGameUsersData,
                seed
            );
            if (JSON.stringify(result) !== JSON.stringify(originalOrder)) {
                foundDifferentOrder = true;
                break;
            }
        }

        expect(foundDifferentOrder).toBe(true);
    });

    it("works with mock data from helpers", () => {
        const result = getGameUserIdsInDeterministicOrder(
            extendedMockGameUsersData,
            mockGamesData[1].share_code
        );
        const expectedIds = extendedMockGameUsersData.map(
            (user) => user.user_id
        );

        expect(result).toHaveLength(expectedIds.length);
        expect(result.sort()).toEqual(expectedIds.sort());
    });

    it("maintains consistency across multiple calls with complex seeds", () => {
        const complexSeeds = [
            `${mockGamesData[0].share_code}_123`,
            `${mockGamesData[1].share_code}!@#$%^&*()_+`,
            `${mockGamesData[2].share_code}🚀🎮🎯`,
            mockGamesData[0].share_code.repeat(10),
            "",
        ];

        complexSeeds.forEach((seed) => {
            const result1 = getGameUserIdsInDeterministicOrder(
                extendedMockGameUsersData,
                seed
            );
            const result2 = getGameUserIdsInDeterministicOrder(
                extendedMockGameUsersData,
                seed
            );

            expect(result1).toEqual(result2);
        });
    });

    it("handles different input orders consistently", () => {
        const reversedGameUsers = [...extendedMockGameUsersData].reverse();
        const shuffledGameUsers = [
            extendedMockGameUsersData[2],
            extendedMockGameUsersData[0],
            extendedMockGameUsersData[3],
            extendedMockGameUsersData[1],
        ];

        const seed = mockGamesData[1].share_code;
        const result1 = getGameUserIdsInDeterministicOrder(
            extendedMockGameUsersData,
            seed
        );
        const result2 = getGameUserIdsInDeterministicOrder(
            reversedGameUsers,
            seed
        );
        const result3 = getGameUserIdsInDeterministicOrder(
            shuffledGameUsers,
            seed
        );

        expect(result1.sort()).toEqual(result2.sort());
        expect(result1.sort()).toEqual(result3.sort());
    });

    it("produces different distributions across multiple seeds", () => {
        const seeds = [
            ...mockGamesData.map((game) => game.share_code),
            ...Array.from(
                { length: 17 },
                (_, i) => `${mockGamesData[0].share_code}_${i}`
            ),
        ];
        const results = seeds.map((seed) =>
            getGameUserIdsInDeterministicOrder(extendedMockGameUsersData, seed)
        );

        const firstPositions = results.map((result) => result[0]);
        const uniqueFirstPositions = new Set(firstPositions);

        expect(uniqueFirstPositions.size).toBeGreaterThan(1);
    });
});
