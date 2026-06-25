/*
 * app-solo.js — single-player controller for the CLIENT-ONLY casino demo.
 *
 * This is the solo counterpart to the multiplayer frontend/app.js. There is no
 * lobby / room code / Socket.io here: you start with a chip bank and pick a
 * table. The game router, theme toggle, and the window.CasinoGames mount/update/
 * unmount contract are identical to the online app, so the verbatim game views
 * (games/*.js) render unchanged. State flows engine -> LocalSocket "room:state"
 * -> routeGame()/renderChrome(), exactly mirroring the online data flow.
 */
(function () {
  "use strict";

  const { el, clear, toast, money } = window.UI;
  const socket = window.casinoSocket;

  window.CasinoGames = window.CasinoGames || {};

  // Solo games to expose (poker is multiplayer-only, omitted by design).
  const GAMES = [
    { id: "roulette", title: "Roulette", blurb: "Single-zero European wheel. Place chips, then spin.", glyph: "◉" },
    { id: "blackjack", title: "Blackjack", blurb: "Sit, bet, and play the dealer. Hit, stand, double, split.", glyph: "♠" },
    { id: "slots", title: "Slots", blurb: "Spin a 5×3 machine across five paylines.", glyph: "🎰" },
    { id: "plinko", title: "Plinko", blurb: "Drop a ball through the pegs into a multiplier slot.", glyph: "⛁" },
  ];

  const state = {
    roomState: null,
    mountedGameId: null,
    gameContainer: null,
  };

  const appRoot = document.getElementById("app");

  // ---- theme toggle (persisted) ----
  const THEME_KEY = "casino.solo.theme";
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const theme = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }
  function themeToggleBtn() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    return el("button", {
      class: "btn btn-ghost icon-btn",
      title: "Toggle light/dark",
      "aria-label": "Toggle theme",
      onclick: (e) => {
        const cur = document.documentElement.getAttribute("data-theme");
        const next = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(THEME_KEY, next);
        e.currentTarget.textContent = next === "dark" ? "☀" : "☾";
      },
    }, isDark ? "☀" : "☾");
  }
  initTheme();

  // ---- ctx for game views (mirrors app.js gameCtx) ----
  function getPlayers() { return (state.roomState && state.roomState.players) || []; }
  function getMyPlayer() {
    return getPlayers().find((p) => p.id === socket.persistentId) || null;
  }
  function gameCtx() {
    return {
      socket,
      persistentId: socket.persistentId,
      getState: () => state.roomState,
      getMyPlayer,
      getPlayers,
      get gameInfo() { return GAMES.find((g) => g.id === (state.roomState && state.roomState.gameId)) || null; },
    };
  }

  // =====================================================================
  // Chrome: top nav + game picker rail
  // =====================================================================
  function renderShell() {
    const nav = buildNav();
    const picker = el("aside", { class: "room__players", id: "game-picker" });
    const main = el("main", { class: "room__main", id: "game-main" });
    state.gameContainer = main;

    const body = el("div", { class: "room__body" }, [
      el("div", { class: "room__sidebar" }, [picker]),
      main,
    ]);

    clear(appRoot).appendChild(el("div", { class: "room rise-in" }, [nav, body]));
    renderPicker();
    routeGame();
  }

  function buildNav() {
    const me = getMyPlayer();
    const balancePill = el("div", { class: "pill nav__balance", id: "nav-balance" },
      me ? [el("span", { class: "nav__balance-label" }, me.name), el("strong", { id: "nav-balance-val" }, money(me.balance))] : "—");

    return el("nav", { class: "nav room__nav" }, [
      el("div", { class: "nav__brand" }, [
        el("span", { class: "nav__logo display" }, "M"),
        el("span", { class: "nav__title" }, "Maison · Solo"),
      ]),
      el("span", { class: "pill accent" }, "Client-only demo"),
      el("div", { class: "nav__spacer" }),
      balancePill,
      el("button", {
        class: "btn btn-secondary btn--sm", title: "Add 1,000 chips",
        onclick: () => { socket.addChips(1000); toast("Added 1,000 chips.", "success"); },
      }, "+1,000"),
      el("button", {
        class: "btn btn-ghost btn--sm", title: "Reset to 1,000 chips",
        onclick: () => { socket.resetChips(); toast("Chips reset.", "info"); },
      }, "Reset"),
      themeToggleBtn(),
    ]);
  }

  function renderPicker() {
    const picker = document.getElementById("game-picker");
    if (!picker) return;
    const currentId = state.roomState && state.roomState.gameId;
    clear(picker);
    picker.appendChild(el("h4", { class: "panel__title" }, "Choose a table"));
    const grid = el("div", { class: "game-cards" });
    GAMES.forEach((g) => {
      const selected = g.id === currentId;
      grid.appendChild(el("button", {
        class: "game-card card card--interactive" + (selected ? " is-selected" : ""),
        onclick: () => pickGame(g.id),
        title: "Play " + g.title,
      }, [
        el("div", { class: "game-card__icon", "aria-hidden": "true" }, g.glyph),
        el("div", { class: "game-card__title" }, g.title),
        el("div", { class: "game-card__blurb caption" }, g.blurb),
        selected ? el("span", { class: "game-card__badge pill accent" }, "At the table") : null,
      ]));
    });
    picker.appendChild(grid);
  }

  function pickGame(gameId) {
    socket.selectGame(gameId).then((res) => {
      if (!res.ok) toast(res.error || "Could not open table.", "error");
    });
  }

  // =====================================================================
  // Game router (identical contract to app.js)
  // =====================================================================
  function routeGame() {
    const container = state.gameContainer;
    if (!container) return;
    const gameId = (state.roomState && state.roomState.gameId) || "lobby";

    if (state.mountedGameId && state.mountedGameId !== gameId) teardownGame();

    if (gameId === "lobby") {
      if (!state.mountedGameId) clear(container).appendChild(emptyTableView());
      return;
    }

    const renderer = window.CasinoGames[gameId];
    if (renderer && typeof renderer.mount === "function") {
      if (state.mountedGameId !== gameId) {
        clear(container);
        state.mountedGameId = gameId;
        try {
          renderer.mount(container, gameCtx());
        } catch (e) {
          console.error("game mount failed:", e);
          clear(container).appendChild(errorView(gameId));
          state.mountedGameId = null;
          return;
        }
      }
      if (typeof renderer.update === "function") {
        try { renderer.update(state.roomState); } catch (e) { console.error("game update failed:", e); }
      }
    }
  }

  function teardownGame() {
    if (state.mountedGameId) {
      const r = window.CasinoGames[state.mountedGameId];
      if (r && typeof r.unmount === "function") {
        try { r.unmount(); } catch (e) { console.error("unmount failed:", e); }
      }
      state.mountedGameId = null;
    }
  }

  function emptyTableView() {
    return el("div", { class: "table-empty rise-in" }, [
      el("div", { class: "table-empty__glyph", "aria-hidden": "true" }, "◉"),
      el("h2", {}, "Pick a table to begin"),
      el("p", { class: "lead" }, "Choose a game on the left. This is a fully client-side demo — your chips live only in this browser tab."),
    ]);
  }
  function errorView(gameId) {
    return el("div", { class: "table-empty rise-in" }, [
      el("div", { class: "table-empty__glyph", "aria-hidden": "true" }, "!"),
      el("h2", {}, "Could not load " + gameId),
      el("p", { class: "lead" }, "Something went wrong rendering this table."),
    ]);
  }

  function updateNavBalance() {
    const me = getMyPlayer();
    const valEl = document.getElementById("nav-balance-val");
    if (valEl && me) {
      const prev = valEl.dataset.v;
      valEl.textContent = money(me.balance);
      if (prev != null && Number(prev) !== me.balance) {
        valEl.classList.remove("bump"); void valEl.offsetWidth; valEl.classList.add("bump");
      }
      valEl.dataset.v = String(me.balance);
    }
  }

  // ---- wiring ----
  socket.on("room:state", (rs) => {
    state.roomState = rs;
    renderPicker();
    updateNavBalance();
    routeGame();
  });

  // ---- boot ----
  socket.getState().then((res) => {
    state.roomState = res.state;
    renderShell();
  });
})();
