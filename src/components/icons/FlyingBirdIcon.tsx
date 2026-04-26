type Props = {
  className?: string
}

/** Ave en vuelo: alas horizontales y cuerpo (trazo, legible a ~15px). */
export function FlyingBirdIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={15}
      height={15}
      className={className}
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s4.5-2.8 10-2.8S22 12 22 12" />
      <path d="M12 12c0-2.8 1.8-5.5 4-6.8" />
      <path d="M12 12c0-2.8-1.8-5.5-4-6.8" />
      <path d="M12 12v2.2" />
    </svg>
  )
}
