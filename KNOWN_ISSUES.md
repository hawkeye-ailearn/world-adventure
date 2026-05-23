# KNOWN_ISSUES.md — World Quest

---

## 🐛 Bugs

_None logged yet._

---

## ⚠️ Limitations

### SonarCloud duplication gate always fails

SonarCloud's Automatic Analysis (GitHub App) ignores `sonar-project.properties`, so CPD exclusions set there have no effect. The project has intentional structural similarity in `src/scenes/**` (5 SVG artwork files following the same spec) and `src/worlds/index.js` (5 config objects with the same shape), pushing duplication to ~18.8% against a 3% threshold.

**Fix (manual, dashboard only):** sonarcloud.io → world-adventure project → Administration → Quality Gates → edit the active gate → raise or remove the "Duplicated Lines on New Code" condition. Alternatively: Administration → Analysis Scope → Duplication Exclusions → add `src/scenes/**` and `src/worlds/index.js`.

---

## 💡 Nice-to-haves

_None logged yet._
