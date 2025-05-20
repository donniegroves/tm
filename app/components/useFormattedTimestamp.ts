import { DateTime } from "luxon";
import { useInsideContext } from "../inside/InsideContext";

/**
 * Returns a formatted timestamp string in the user's timezone (if available),
 * or defaults to UTC if not found. Format: M/d/yyyy h:mma (lowercase)
 * @param isoString ISO date string to format
 * @returns Formatted date string
 */
export function useFormattedTimestamp() {
    const { loggedInUserId, allUsers } = useInsideContext();
    // Find the user's timezone, fallback to UTC
    const user = allUsers?.find((u) => u.user_id === loggedInUserId);
    const timezone = user?.timezone || "UTC";

    return (isoString: string) => {
        return DateTime.fromISO(isoString, { zone: timezone })
            .toFormat("M/d/yyyy h:mma")
            .toLowerCase();
    };
}
