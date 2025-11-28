export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Carro */}
      <path
        d="M20 60 L30 45 L70 45 L80 60 Z"
        fill="#3B82F6"
        stroke="#1E40AF"
        strokeWidth="2"
      />
      <rect
        x="25"
        y="60"
        width="50"
        height="15"
        fill="#3B82F6"
        stroke="#1E40AF"
        strokeWidth="2"
        rx="2"
      />

      {/* Rodas */}
      <circle
        cx="32"
        cy="75"
        r="8"
        fill="#1F2937"
        stroke="#111827"
        strokeWidth="2"
      />
      <circle cx="32" cy="75" r="4" fill="#6B7280" />
      <circle
        cx="68"
        cy="75"
        r="8"
        fill="#1F2937"
        stroke="#111827"
        strokeWidth="2"
      />
      <circle cx="68" cy="75" r="4" fill="#6B7280" />

      {/* Janelas */}
      <path d="M35 50 L40 58 L60 58 L65 50 Z" fill="#93C5FD" opacity="0.7" />

      {/* Símbolo de notificação/sino */}
      <circle
        cx="75"
        cy="30"
        r="12"
        fill="#FCD34D"
        stroke="#F59E0B"
        strokeWidth="2"
      />
      <path
        d="M75 25 L75 32 M71 35 L79 35"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="75" cy="37" r="1.5" fill="#F59E0B" />
    </svg>
  );
}
