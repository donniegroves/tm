"use client";

export type SvgIconProps = {
    fill?: string;
    size?: number;
    height?: number;
    width?: number;
    className?: string;
};

export const DownArrowSvg = ({
    fill = "currentColor",
    size,
    height,
    width,
    className,
}: SvgIconProps) => (
    <svg
        className={className}
        fill={fill}
        height={size || height || 24}
        width={size || width || 24}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25.93 25.93"
    >
        <path
            d="M25.397,4.554h-2.042l-9.974,12.644c-0.101,0.124-0.256,0.197-0.416,0.197c-0.164,0-0.315-0.073-0.419-0.197L2.575,4.554
		H0.532c-0.206,0-0.392,0.115-0.479,0.299c-0.09,0.184-0.064,0.403,0.06,0.561l12.435,15.762c0.104,0.125,0.255,0.2,0.419,0.2
		c0.16,0,0.315-0.075,0.416-0.2L25.816,5.413c0.128-0.157,0.148-0.377,0.058-0.561C25.789,4.669,25.601,4.554,25.397,4.554z"
        />
    </svg>
);

export const SignOutSvg = ({
    fill = "currentColor",
    size,
    height,
    width,
    className,
}: SvgIconProps) => (
    <svg
        className={className}
        width={size || width || 24}
        height={size || height || 24}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.593 10.943c.584.585.584 1.53 0 2.116L18.71 15.95c-.39.39-1.03.39-1.42 0a.996.996 0 0 1 0-1.41 9.552 9.552 0 0 1 1.689-1.345l.387-.242-.207-.206a10 10 0 0 1-2.24.254H8.998a1 1 0 1 1 0-2h7.921a10 10 0 0 1 2.24.254l.207-.206-.386-.241a9.562 9.562 0 0 1-1.69-1.348.996.996 0 0 1 0-1.41c.39-.39 1.03-.39 1.42 0l2.883 2.893zM14 16a1 1 0 0 0-1 1v1.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1.505a1 1 0 1 0 2 0V5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v13A2.5 2.5 0 0 0 5.5 21h7a2.5 2.5 0 0 0 2.5-2.5V17a1 1 0 0 0-1-1z"
            fill={fill}
        />
    </svg>
);

export const UserIcon = ({
    fill = "currentColor",
    size,
    height,
    width,
    className,
}: SvgIconProps) => (
    <svg
        className={className}
        height={size || height || 24}
        viewBox="0 0 24 24"
        width={size || width || 24}
        xmlns="http://www.w3.org/2000/svg"
    >
        <g
            fill="none"
            stroke={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.5}
        >
            <path d="M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z" />
            <path d="M11.837 11.174a4.372 4.372 0 10-.031 0z" />
        </g>
    </svg>
);
