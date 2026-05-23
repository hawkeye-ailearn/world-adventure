export default function IndiaScene() {
  return (
    <svg width="100%" viewBox="0 0 380 180" xmlns="http://www.w3.org/2000/svg">
      {/* Sunset sky */}
      <rect width="380" height="180" fill="#c03010" />
      <rect width="380" height="130" fill="#e04820" opacity="0.5" />
      <rect width="380" height="90" fill="#f08030" opacity="0.4" />
      <rect width="380" height="60" fill="#f8b050" opacity="0.3" />
      {/* Sun */}
      <circle cx="60" cy="62" r="26" fill="#FFD060" opacity="0.9" />
      <circle cx="60" cy="62" r="20" fill="#FFC040" />
      {/* Horizon haze */}
      <rect y="95" width="380" height="20" fill="#8a2008" opacity="0.45" />
      {/* Temple gopuram (tower) */}
      {/* Main tower body */}
      <rect x="145" y="55" width="60" height="95" fill="#3a0e02" />
      {/* Tapering tiers */}
      <polygon points="135,55 175,10 215,55" fill="#4a1204" />
      <polygon points="142,55 175,22 208,55" fill="#5a1808" />
      {/* Tier decorations */}
      <rect x="148" y="65" width="54" height="6" fill="#7a2810" opacity="0.6" />
      <rect x="148" y="78" width="54" height="6" fill="#7a2810" opacity="0.6" />
      <rect x="148" y="91" width="54" height="6" fill="#7a2810" opacity="0.6" />
      {/* Gopuram top finial */}
      <ellipse cx="175" cy="10" rx="8" ry="5" fill="#7a2810" />
      <rect x="173" y="3" width="4" height="12" fill="#5a1808" />
      {/* Side structures */}
      <rect x="100" y="90" width="45" height="60" fill="#2a0a02" />
      <rect x="215" y="90" width="45" height="60" fill="#2a0a02" />
      {/* Lotus pond */}
      <ellipse cx="175" cy="158" rx="65" ry="12" fill="#1a4a6a" opacity="0.8" />
      <ellipse cx="175" cy="158" rx="55" ry="9" fill="#2a6a8a" opacity="0.6" />
      {/* Lotus flowers */}
      <ellipse cx="155" cy="156" rx="6" ry="4" fill="#e06080" opacity="0.8" />
      <ellipse cx="175" cy="154" rx="6" ry="4" fill="#f07090" opacity="0.8" />
      <ellipse cx="195" cy="157" rx="5" ry="3" fill="#e06080" opacity="0.7" />
      {/* Elephant */}
      <ellipse cx="320" cy="135" rx="25" ry="18" fill="#1e0a02" />
      <rect x="295" y="130" width="9" height="22" fill="#1e0a02" />
      <rect x="307" y="130" width="9" height="22" fill="#1e0a02" />
      <rect x="319" y="130" width="9" height="22" fill="#1e0a02" />
      <rect x="331" y="130" width="9" height="22" fill="#1e0a02" />
      <ellipse cx="293" cy="130" rx="10" ry="7" fill="#1e0a02" />
      <rect x="283" y="127" width="4" height="14" fill="#1e0a02" />
      {/* Ground */}
      <rect x="0" y="155" width="380" height="25" fill="#3a0c02" />
      <rect x="0" y="152" width="380" height="5" fill="#5a1808" opacity="0.5" />
    </svg>
  )
}
