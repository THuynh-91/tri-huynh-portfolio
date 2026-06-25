/*
 * engines-register.js — collect the verbatim engine classes (loaded into the
 * CasinoCJS registry) into window.CasinoEngines keyed by gameId, the same keys
 * the backend registry uses. Runs after all engine <script>s have committed.
 */
(function () {
  "use strict";
  function cls(name) {
    const mod = window.CasinoCJS.get(name);
    // engines export the class directly AND as .Engine
    return (typeof mod === "function" && mod) || (mod && mod.Engine) || null;
  }
  window.CasinoEngines = {
    roulette: cls("roulette-engine"),
    blackjack: cls("blackjack-engine"),
    slots: cls("slots-engine"),
    plinko: cls("plinko-engine"),
  };
})();
