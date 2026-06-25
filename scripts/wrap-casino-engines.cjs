// Re-copy each backend engine/lib file from the Roulette repo, wrapped in a
// CommonJS-style closure so top-level declarations don't collide in the browser's
// shared global script scope. Registers via CasinoCJS.register(name, factory).
const fs = require("fs");
const path = require("path");
const src = "C:/Dev/Visual Studio/Roulette/backend";
const dst = "C:/Dev/Visual Studio/Portfolio_Website/public/demos/casino/engine";
const files = [
  ["lib/rng.js", "rng"],
  ["lib/validate.js", "validate"],
  ["lib/cards.js", "cards"],
  ["games/roulette-core.js", "roulette-core"],
  ["games/roulette-engine.js", "roulette-engine"],
  ["games/blackjack-engine.js", "blackjack-engine"],
  ["games/slots-engine.js", "slots-engine"],
  ["games/plinko-engine.js", "plinko-engine"],
];
const header = (name) =>
`/* AUTO-WRAPPED from C:\Dev\Visual Studio\Roulette\backend — DO NOT EDIT BY HAND.
 * Original source is unchanged inside the closure; only the CommonJS wrapper is
 * added so it runs in the browser without polluting the global scope or
 * colliding with other engine files. Regenerate via scripts/wrap-engines.js. */
CasinoCJS.register(${JSON.stringify(name)}, function (module, exports, require, globalThis) {
"use strict";
`;
const footer = `
return module.exports;
});
`;
for (const [rel, name] of files) {
  let code = fs.readFileSync(path.join(src, rel), "utf8");
  // Drop a leading "use strict"; line in the original (we add our own).
  code = code.replace(/^\s*["']use strict["'];?\s*\n/, "");
  const out = header(name) + code + footer;
  fs.writeFileSync(path.join(dst, name + ".js"), out, "utf8");
  console.log("wrapped", name);
}
