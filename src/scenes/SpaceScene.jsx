export default function SpaceScene() {
  return (
    <svg width="100%" viewBox="0 0 380 180" xmlns="http://www.w3.org/2000/svg">
      {/* Deep space background */}
      <rect width="380" height="180" fill="#02000f" />
      <rect width="380" height="180" fill="#08004a" opacity="0.5" />
      {/* Stars */}
      {[
        [30,15],[70,8],[110,22],[155,5],[190,18],[225,30],[260,10],[295,25],[340,8],[360,20],
        [20,50],[85,42],[140,55],[180,38],[220,60],[265,45],[310,35],[355,55],
        [50,80],[100,72],[145,88],[185,75],[230,82],[270,70],[315,90],[350,78],
        [15,110],[75,102],[130,118],[170,105],[215,112],[255,100],[300,115],[345,108],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={Math.random() > 0.5 ? 1.2 : 0.8} fill="white" opacity={0.4 + (i % 5) * 0.1} />
      ))}
      {/* Nebula glow */}
      <rect x="180" y="20" width="120" height="60" fill="#4a0080" opacity="0.15" rx="30" />
      <rect x="200" y="30" width="80" height="40" fill="#7b00c0" opacity="0.1" rx="20" />
      {/* Saturn */}
      <ellipse cx="300" cy="55" rx="28" ry="18" fill="#c4a060" />
      <ellipse cx="300" cy="55" rx="28" ry="18" fill="#d4b070" opacity="0.6" />
      <ellipse cx="300" cy="55" rx="45" ry="9" fill="none" stroke="#e8c880" strokeWidth="5" opacity="0.7" />
      <ellipse cx="300" cy="55" rx="45" ry="9" fill="none" stroke="#c4a060" strokeWidth="2" opacity="0.5" />
      {/* Earth curve at bottom */}
      <ellipse cx="190" cy="220" rx="200" ry="100" fill="#1a4a7a" opacity="0.8" />
      <ellipse cx="190" cy="220" rx="200" ry="100" fill="#2a6aaa" opacity="0.4" />
      {/* Continents on Earth */}
      <rect x="100" y="155" width="40" height="20" fill="#2a7a2a" opacity="0.7" rx="5" />
      <rect x="210" y="158" width="30" height="15" fill="#2a7a2a" opacity="0.6" rx="4" />
      {/* Space station truss suggestion */}
      <rect x="30" y="82" width="80" height="4" fill="#8899bb" opacity="0.8" />
      <rect x="66" y="72" width="4" height="24" fill="#8899bb" opacity="0.8" />
      <rect x="30" y="78" width="12" height="12" fill="#667799" opacity="0.8" rx="1" />
      <rect x="98" y="78" width="12" height="12" fill="#667799" opacity="0.8" rx="1" />
      {/* Foreground black void */}
      <rect x="0" y="160" width="380" height="20" fill="#02000f" />
    </svg>
  )
}
