export default function EgyptScene() {
  return (
    <svg width="100%" viewBox="0 0 380 180" xmlns="http://www.w3.org/2000/svg">
      {/* Sky layers */}
      <rect width="380" height="180" fill="#E8A030" />
      <rect width="380" height="180" fill="#c06010" opacity="0.35" />
      <rect width="380" height="100" fill="#f0c060" opacity="0.25" />
      {/* Sun */}
      <circle cx="310" cy="48" r="28" fill="#FFE066" opacity="0.9" />
      <circle cx="310" cy="48" r="22" fill="#FFD700" />
      {/* Distant haze band */}
      <rect y="100" width="380" height="20" fill="#d4720a" opacity="0.4" />
      {/* Pyramids */}
      <polygon points="40,140 105,55 170,140" fill="#7d3a00" />
      <polygon points="130,140 185,72 240,140" fill="#5c2900" />
      <polygon points="220,140 262,85 304,140" fill="#7d3a00" opacity="0.8" />
      {/* Nile */}
      <rect x="0" y="138" width="380" height="10" fill="#3a7ab0" opacity="0.7" />
      <rect x="0" y="136" width="380" height="4" fill="#5aaae0" opacity="0.4" />
      {/* Sand foreground */}
      <rect x="0" y="145" width="380" height="35" fill="#7d3a00" />
      <rect x="0" y="145" width="380" height="8" fill="#a04a10" opacity="0.5" />
      {/* Palm trees */}
      <rect x="335" y="118" width="4" height="30" fill="#412402" />
      <ellipse cx="337" cy="115" rx="12" ry="8" fill="#2a5c10" opacity="0.9" />
      <ellipse cx="325" cy="112" rx="9" ry="6" fill="#2a5c10" opacity="0.7" />
      <rect x="20" y="122" width="3" height="26" fill="#412402" />
      <ellipse cx="21" cy="119" rx="10" ry="7" fill="#2a5c10" opacity="0.85" />
    </svg>
  )
}
