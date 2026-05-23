export default function SafariScene() {
  return (
    <svg width="100%" viewBox="0 0 380 180" xmlns="http://www.w3.org/2000/svg">
      {/* Sky - warm dusk */}
      <rect width="380" height="180" fill="#e87820" />
      <rect width="380" height="120" fill="#f0a030" opacity="0.5" />
      <rect width="380" height="80" fill="#f8d060" opacity="0.3" />
      {/* Sun near horizon */}
      <circle cx="190" cy="90" r="30" fill="#FFE066" opacity="0.85" />
      <circle cx="190" cy="90" r="24" fill="#FFD030" opacity="0.9" />
      {/* Horizon haze */}
      <rect y="98" width="380" height="18" fill="#c05010" opacity="0.45" />
      {/* Distant savanna */}
      <rect y="108" width="380" height="72" fill="#6b3a08" />
      {/* Acacia tree left */}
      <rect x="50" y="90" width="6" height="50" fill="#3a1c04" />
      <ellipse cx="53" cy="83" rx="32" ry="14" fill="#1a3a06" />
      <ellipse cx="35" cy="88" rx="18" ry="10" fill="#1a3a06" opacity="0.8" />
      <ellipse cx="73" cy="86" rx="20" ry="10" fill="#1a3a06" opacity="0.8" />
      {/* Acacia tree right */}
      <rect x="290" y="95" width="5" height="45" fill="#3a1c04" />
      <ellipse cx="292" cy="89" rx="28" ry="12" fill="#1a3a06" />
      <ellipse cx="276" cy="93" rx="16" ry="9" fill="#1a3a06" opacity="0.8" />
      <ellipse cx="310" cy="92" rx="17" ry="9" fill="#1a3a06" opacity="0.8" />
      {/* Giraffe silhouette */}
      <rect x="190" y="98" width="7" height="38" fill="#3a1c04" />
      <rect x="190" y="80" width="5" height="22" fill="#3a1c04" />
      <rect x="192" y="70" width="3" height="14" fill="#3a1c04" />
      <ellipse cx="193" cy="69" rx="5" ry="4" fill="#3a1c04" />
      {/* Elephant silhouette */}
      <ellipse cx="140" cy="130" rx="22" ry="16" fill="#2a1404" />
      <rect x="118" y="125" width="8" height="18" fill="#2a1404" />
      <rect x="130" y="125" width="8" height="18" fill="#2a1404" />
      <rect x="142" y="125" width="8" height="18" fill="#2a1404" />
      <rect x="154" y="125" width="8" height="18" fill="#2a1404" />
      <ellipse cx="116" cy="126" rx="8" ry="6" fill="#2a1404" />
      <rect x="108" y="122" width="3" height="12" fill="#2a1404" />
      {/* Ground */}
      <rect x="0" y="150" width="380" height="30" fill="#4a2800" />
      <rect x="0" y="147" width="380" height="5" fill="#7a4010" opacity="0.6" />
    </svg>
  )
}
