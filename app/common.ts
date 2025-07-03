export const Strings = {
    EMAIL_PLACEHOLDER: "me@example.com",
    EMAIL_PW_REQUIRED: "Email and password are required.",
    USER_EXISTS:
        "This user already exists. Please sign in using the method originally used to sign up.",
    INVALID_CREDS: "Invalid credentials. Please try again.",
    FAILED_TO_SEND_EMAIL: "Failure during send of email.",
    ERROR_SIGNING_IN:
        "There was an error signing you in. Please try again later.",
    GENERIC: "An error occurred. Please try again later.",
    PW_RESET_SENT:
        "If the email address you provided is registered with us, a password reset email has been sent.",
};

export enum AccessLevel {
    USER = 0,
    RESERVED = 1,
    SUPERADMIN = 2,
}

export const timezones = [
    { key: "Pacific/Midway", label: "US Outlying Islands" },
    { key: "Pacific/Honolulu", label: "Hawaii" },
    { key: "America/Anchorage", label: "Alaska" },
    { key: "America/Los_Angeles", label: "US West Coast" },
    { key: "America/Denver", label: "US Mountain Time" },
    { key: "America/Chicago", label: "US Central Time" },
    { key: "America/New_York", label: "US Eastern Time" },
    { key: "America/Toronto", label: "Canada (Toronto)" },
    { key: "America/Mexico_City", label: "Mexico City" },
    { key: "America/Sao_Paulo", label: "Brazil (Sao Paulo)" },
    { key: "America/Buenos_Aires", label: "Argentina" },
    { key: "UTC", label: "UTC" },
    { key: "Europe/London", label: "UK (London)" },
    { key: "Europe/Paris", label: "France (Paris)" },
    { key: "Europe/Berlin", label: "Germany (Berlin)" },
    { key: "Europe/Rome", label: "Italy (Rome)" },
    { key: "Europe/Madrid", label: "Spain (Madrid)" },
    { key: "Europe/Moscow", label: "Russia (Moscow)" },
    { key: "Africa/Cairo", label: "Egypt (Cairo)" },
    { key: "Africa/Johannesburg", label: "South Africa (Johannesburg)" },
    { key: "Asia/Jerusalem", label: "Israel (Jerusalem)" },
    { key: "Asia/Dubai", label: "UAE (Dubai)" },
    { key: "Asia/Karachi", label: "Pakistan (Karachi)" },
    { key: "Asia/Kolkata", label: "India (Kolkata)" },
    { key: "Asia/Dhaka", label: "Bangladesh (Dhaka)" },
    { key: "Asia/Jakarta", label: "Indonesia (Jakarta)" },
    { key: "Asia/Bangkok", label: "Thailand (Bangkok)" },
    { key: "Asia/Shanghai", label: "China (Shanghai)" },
    { key: "Asia/Tokyo", label: "Japan (Tokyo)" },
    { key: "Asia/Seoul", label: "South Korea (Seoul)" },
    { key: "Australia/Sydney", label: "Australia (Sydney)" },
    { key: "Pacific/Auckland", label: "New Zealand (Auckland)" },
];
