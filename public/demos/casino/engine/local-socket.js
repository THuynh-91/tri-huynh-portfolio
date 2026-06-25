/*
 * local-socket.js — a drop-in, client-only replacement for the real
 * casinoSocket (frontend/lib/socket-client.js), backed by a LocalRoom + the
 * verbatim game engines instead of a Socket.io connection.
 *
 * It exposes the same surface the game views + app use:
 *   socket.persistentId
 *   socket.gameAction(action) -> Promise<{ok, error?}>
 *   socket.selectGame(gameId) -> Promise<{ok, error?}>
 *   socket.getState()         -> Promise<{ok, state}>
 *   socket.on(event, fn)/off  -> local event bus ("room:state")
 *   socket.lastState
 *
 * Engines are server-authoritative in the original; here we run them locally and
 * synchronously, then push a "room:state" with the fresh public state so the
 * views re-render exactly as they do online.
 */
(function () {
  "use strict";

  const { LocalRoom } = window.CasinoLocal;

  function newPid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "solo-" + Math.random().toString(36).slice(2);
  }

  class LocalSocket {
    constructor() {
      this.persistentId = newPid();
      this.room = new LocalRoom(this.persistentId, "You");
      this.listeners = Object.create(null);
      this.lastState = null;
      this.rng = window.CasinoCJS.get("rng"); // verbatim crypto-backed rng
      // ctx handed to every engine — broadcast() re-emits authoritative state.
      this.ctx = {
        rng: this.rng,
        log: function () {},
        broadcast: () => this._broadcast(),
      };
    }

    // ---- event bus (mirrors socket-client.js) ----
    on(event, fn) {
      (this.listeners[event] || (this.listeners[event] = new Set())).add(fn);
      return () => this.off(event, fn);
    }
    off(event, fn) {
      if (this.listeners[event]) this.listeners[event].delete(fn);
    }
    _emit(event) {
      const set = this.listeners[event];
      if (!set) return;
      const args = Array.prototype.slice.call(arguments, 1);
      for (const fn of Array.from(set)) {
        try { fn.apply(null, args); } catch (e) { console.error("listener error", event, e); }
      }
    }

    _state() {
      this.lastState = this.room.publicState(this.persistentId);
      return this.lastState;
    }
    _broadcast() {
      this._emit("room:state", this._state());
    }

    // ---- engine lifecycle ----
    selectGame(gameId) {
      return new Promise((resolve) => {
        const EngineClass = window.CasinoEngines && window.CasinoEngines[gameId];
        if (!EngineClass) return resolve({ ok: false, error: "Unknown game" });
        if (this.room.engine && this.room.engine.dispose) {
          try { this.room.engine.dispose(); } catch (_) {}
        }
        this.room.gameId = gameId;
        this.room.engine = new EngineClass(this.room, this.ctx);
        if (this.room.engine.onPlayerJoin) {
          try { this.room.engine.onPlayerJoin(this.persistentId); } catch (_) {}
        }
        this._broadcast();
        resolve({ ok: true });
      });
    }

    gameAction(action) {
      return new Promise((resolve) => {
        const engine = this.room.engine;
        if (!engine) return resolve({ ok: false, error: "No game selected" });
        if (action === null || typeof action !== "object") {
          return resolve({ ok: false, error: "Bad payload" });
        }
        let res;
        try {
          res = engine.handleAction(this.persistentId, action);
        } catch (e) {
          console.error("engine error:", e);
          res = { ok: false, error: "Game error" };
        }
        resolve(res || { ok: true });
      });
    }

    getState() {
      return Promise.resolve({ ok: true, state: this._state() });
    }

    // ---- local-only chip bank (replaces the multiplayer admin "grant") ----
    addChips(amount) {
      this.room.credit(this.persistentId, amount);
      this._broadcast();
    }
    resetChips() {
      this.room.setBalance(this.persistentId, window.CasinoLocal.STARTING_BALANCE);
      this._broadcast();
    }
  }

  window.casinoSocket = new LocalSocket();
})();
