/*
 * _wrap.js — a tiny CommonJS registry that lets the verbatim casino game engines
 * (ported from C:\Dev\Visual Studio\Roulette\backend) run in the browser with no
 * bundler and no server.
 *
 * Each engine file is AUTO-WRAPPED (see scripts/wrap-casino-engines.cjs) into:
 *
 *   CasinoCJS.register("name", function (module, exports, require, globalThis) {
 *     ... original file body, unchanged ...
 *     return module.exports;
 *   });
 *
 * Wrapping in a function is essential: classic <script> files share one global
 * lexical scope, so the engines' top-level `const`/`let` (e.g. `shuffle`,
 * `isPosInt`) would collide across files. The closure gives each file its own
 * scope plus working `module`/`exports`/`require`, exactly like Node.
 *
 * require() resolves by basename (the engines use relative ids like
 * "../lib/validate" / "./roulette-core"; we collapse to "validate" /
 * "roulette-core"). A Node-style `crypto` with randomBytes() is provided so the
 * crypto-backed rng works in the browser.
 */
(function () {
  "use strict";

  // ---- Browser crypto shim mimicking Node's crypto.randomBytes(n) ----------
  const nodeCrypto = {
    randomBytes(n) {
      const buf = new Uint8Array(n);
      (window.crypto || window.msCrypto).getRandomValues(buf);
      // rng.js calls buf.readUInt32BE(0); provide a Buffer-like method.
      buf.readUInt32BE = function (offset) {
        offset = offset || 0;
        return (
          (this[offset] * 0x1000000) +
          ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3])
        ) >>> 0;
      };
      return buf;
    },
  };

  const registry = Object.create(null);
  registry["crypto"] = nodeCrypto;

  function canonical(id) {
    let s = id.replace(/\.js$/, "");
    s = s.replace(/^.*\//, ""); // basename only
    return s;
  }

  function requireFn(id) {
    const key = canonical(id);
    if (key in registry) return registry[key];
    throw new Error("CasinoCJS: cannot require '" + id + "' (key '" + key + "')");
  }

  const CJS = {
    crypto: nodeCrypto,
    // Define + immediately evaluate a wrapped module, storing its exports.
    register(name, factory) {
      const module = { exports: {} };
      const result = factory(module, module.exports, requireFn, window);
      registry[name] = result || module.exports;
      return registry[name];
    },
    get(name) {
      if (!(name in registry)) throw new Error("CasinoCJS: module not loaded: " + name);
      return registry[name];
    },
    has(name) { return name in registry; },
  };

  window.CasinoCJS = CJS;
})();
