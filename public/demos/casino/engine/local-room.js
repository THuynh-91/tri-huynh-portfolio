/*
 * local-room.js — a CLIENT-ONLY, single-player port of the casino Room model.
 *
 * The real casino (C:\Dev\Visual Studio\Roulette) is server-authoritative: a
 * Node Room holds player balances and the live game engine, and Socket.io
 * broadcasts per-viewer state. For the portfolio's GitHub Pages demo there is no
 * backend, so this file recreates the SAME Room money API the engines expect
 * (debit/credit/setBalance/getPlayer/players/playerList) entirely in the
 * browser, for ONE local player. The engines themselves are reused VERBATIM via
 * the CasinoCJS registry, so all game logic and payouts are identical to the
 * multiplayer version — only the transport and the multi-player parts are gone.
 */
(function () {
  "use strict";

  const STARTING_BALANCE = 1000;

  function makePlayer(persistentId, name) {
    return {
      id: persistentId,
      persistentId: persistentId,
      name: name || "You",
      balance: STARTING_BALANCE,
      connected: true,
      isAdmin: false,
      seat: null,
      publicView() {
        return {
          id: this.persistentId,
          name: this.name,
          balance: this.balance,
          connected: this.connected,
          isAdmin: this.isAdmin,
          seat: this.seat,
        };
      },
    };
  }

  // A minimal Room that satisfies the engine contract for a single local player.
  class LocalRoom {
    constructor(persistentId, name) {
      this.code = "SOLO";
      this.players = new Map(); // persistentId -> player
      const p = makePlayer(persistentId, name);
      this.players.set(persistentId, p);
      this.gameId = "lobby";
      this.engine = null;
    }

    getPlayer(pid) { return this.players.get(pid); }

    // ---- Money: same semantics as backend/lib/rooms.js ----
    debit(pid, amount) {
      const p = this.players.get(pid);
      if (!p) return false;
      amount = Math.floor(amount);
      if (amount <= 0 || p.balance < amount) return false;
      p.balance -= amount;
      return true;
    }
    credit(pid, amount) {
      const p = this.players.get(pid);
      if (!p) return false;
      amount = Math.floor(amount);
      if (amount <= 0) return false;
      p.balance += amount;
      return true;
    }
    setBalance(pid, amount) {
      const p = this.players.get(pid);
      if (!p) return false;
      p.balance = Math.max(0, Math.floor(amount));
      return true;
    }

    playerList() {
      return Array.from(this.players.values()).map((p) => p.publicView());
    }

    publicState(viewerId) {
      return {
        code: this.code,
        gameId: this.gameId,
        players: this.playerList(),
        game: this.engine ? this.engine.getPublicState(viewerId) : null,
      };
    }
  }

  window.CasinoLocal = window.CasinoLocal || {};
  window.CasinoLocal.LocalRoom = LocalRoom;
  window.CasinoLocal.STARTING_BALANCE = STARTING_BALANCE;
})();
