# KNOWN_ISSUES.md — World Quest

---

## 🐛 Bugs

_None logged yet._

---

## ⚠️ Limitations

**WorldMap zone positions may need device tuning**
`ZONE_POSITIONS` in `src/components/WorldMap.jsx` are percentage coordinates hand-tuned against the `world-map.png` artwork at desktop resolution. They should be accurate (the inner box is aspect-ratio-locked to `1448/1086` so overlays don't drift), but minor adjustments may be needed once tested on the actual iPad to account for how the image renders at smaller sizes.

---

## 💡 Nice-to-haves

_None logged yet._
