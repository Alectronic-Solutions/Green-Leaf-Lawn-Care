export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M10 22C10 14 15 9 23 8C22.6 15.5 18.5 21 10 22Z"
        className="fill-primary-foreground"
      />
      <path
        d="M10.5 21.5C13 16.5 16.5 13 21.5 9.8"
        fill="none"
        className="stroke-primary"
        strokeWidth={1}
        strokeLinecap="round"
      />
    </svg>
  );
}
