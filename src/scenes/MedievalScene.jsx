export default function MedievalScene() {
  return (
    <svg width="100%" viewBox="0 0 380 180" xmlns="http://www.w3.org/2000/svg">
      {/* Night sky */}
      <rect width="380" height="180" fill="#0a1428" />
      <rect width="380" height="100" fill="#1a2a50" opacity="0.6" />
      {/* Moon */}
      <circle cx="60" cy="42" r="22" fill="#d4d8e8" opacity="0.9" />
      <circle cx="72" cy="38" r="18" fill="#0a1428" />
      {/* Stars */}
      <circle cx="120" cy="20" r="1.5" fill="white" opacity="0.8" />
      <circle cx="200" cy="15" r="1" fill="white" opacity="0.7" />
      <circle cx="280" cy="30" r="1.5" fill="white" opacity="0.9" />
      <circle cx="340" cy="12" r="1" fill="white" opacity="0.6" />
      <circle cx="160" cy="35" r="1" fill="white" opacity="0.8" />
      <circle cx="240" cy="22" r="1.5" fill="white" opacity="0.7" />
      <circle cx="310" cy="50" r="1" fill="white" opacity="0.5" />
      {/* Forest background */}
      <rect x="0" y="80" width="380" height="100" fill="#0d2010" />
      {/* Tree silhouettes */}
      <polygon points="0,140 20,80 40,140" fill="#071a05" />
      <polygon points="30,140 55,70 80,140" fill="#071a05" />
      <polygon points="300,140 325,75 350,140" fill="#071a05" />
      <polygon points="340,140 365,85 380,140" fill="#071a05" />
      <polygon points="150,140 175,65 200,140" fill="#071a05" />
      <polygon points="190,140 210,78 230,140" fill="#0a2208" />
      {/* Castle */}
      <rect x="230" y="75" width="120" height="70" fill="#1a2744" />
      <rect x="238" y="62" width="18" height="30" fill="#1a2744" />
      <rect x="314" y="62" width="18" height="30" fill="#1a2744" />
      <rect x="274" y="55" width="20" height="35" fill="#243358" />
      {/* Castle battlements */}
      <rect x="238" y="58" width="5" height="8" fill="#243358" />
      <rect x="246" y="58" width="5" height="8" fill="#243358" />
      <rect x="254" y="58" width="5" height="8" fill="#243358" />
      <rect x="314" y="58" width="5" height="8" fill="#243358" />
      <rect x="322" y="58" width="5" height="8" fill="#243358" />
      {/* Castle gate */}
      <rect x="278" y="110" width="12" height="22" fill="#060e20" rx="6" />
      {/* Castle window lights */}
      <rect x="252" y="90" width="8" height="10" fill="#f2cc60" opacity="0.7" rx="1" />
      <rect x="322" y="90" width="8" height="10" fill="#f2cc60" opacity="0.7" rx="1" />
      {/* Ground */}
      <rect x="0" y="148" width="380" height="32" fill="#0c1c0a" />
      <rect x="0" y="145" width="380" height="6" fill="#1a3014" opacity="0.7" />
    </svg>
  )
}
