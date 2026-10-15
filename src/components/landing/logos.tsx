type MarkProps = { className?: string };

function HexMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Zm0 3.2L6 8.6v6.8l6 3.4 6-3.4V8.6l-6-3.4Z" />
    </svg>
  );
}

function RingsMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}

function StackMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2 23 8l-11 6L1 8l11-6Zm0 7.7L5.6 6.2 12 3.3l6.4 2.9L12 9.7Z" />
      <path d="m2 13 10 5.5L22 13l-2.2 1.2L12 18.5 4.2 14.2 2 13Z" />
    </svg>
  );
}

function BoltMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function OrbitMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="currentColor" strokeWidth="2" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.5"
        stroke="currentColor"
        strokeWidth="2"
        transform="rotate(60 12 12)"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

function GridMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm13.5 0a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  );
}

export const companies = [
  { name: "Northwind", Mark: HexMark },
  { name: "Quanta", Mark: RingsMark },
  { name: "Stackline", Mark: StackMark },
  { name: "Voltify", Mark: BoltMark },
  { name: "Orbital", Mark: OrbitMark },
  { name: "Gridwork", Mark: GridMark },
];
