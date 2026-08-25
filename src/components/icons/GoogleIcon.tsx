/** Official multicolor Google "G" logo for OAuth buttons. */
export function GoogleIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.91 3.28-4.73 3.28-8.09Z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.19v2.84A11 11 0 0 0 12 23Z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.19a11 11 0 0 0 0 9.88L5.84 14.1Z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.16-3.15A11 11 0 0 0 2.19 7.06l3.65 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
                fill="#EA4335"
            />
        </svg>
    );
}