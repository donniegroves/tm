import { updatePublicUserRow } from "./updatePublicUserRow";

export function updateProfile(userId: string) {
    const form = document.getElementById("profile-form");
    if (!form) {
        console.warn("Profile form not found");
        return;
    }

    const usernameInput = form.querySelector("input");
    const timezoneSelect = form.querySelector("select");
    const username = usernameInput
        ? (usernameInput as HTMLInputElement).value
        : undefined;
    const timezone = timezoneSelect
        ? (timezoneSelect as HTMLSelectElement).value
        : undefined;

    updatePublicUserRow(userId, {
        username: username,
        timezone: timezone,
    });
}
