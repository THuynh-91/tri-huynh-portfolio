/*
 * Double-pendulum-on-a-cart physics — used by the live simulation (pendulum.html,
 * "Double" tab) and its own test suite (tests/physics-double.test.js).
 *
 * This is a SEPARATE module from the verified single-pendulum physics.js. The
 * single-pendulum equations are not touched here.
 *
 * Model: a cart of mass M slides on a horizontal rail (coordinate x, driven by
 * a horizontal motor force F and viscous rail damping cR). Hanging off the cart
 * is a first massless rigid rod of length L1 with a point bob m1 at its end;
 * off that bob hangs a second massless rod L2 with point bob m2. The angles
 * th1, th2 are measured from straight DOWN (th = 0 hangs at rest). Viscous
 * pivot damping cP acts on BOTH joints as a torque proportional to the joint's
 * angular RATE relative to its parent:
 *      joint 1 rate = om1            (relative to the cart)
 *      joint 2 rate = om2 - om1      (relative to rod 1)
 * so the generalized damping forces are
 *      Q_th1 = -cP*om1 + cP*(om2 - om1)   (reaction from joint 2)
 *      Q_th2 = -cP*(om2 - om1)
 * This is the physically correct way to damp a chain: each hinge resists its
 * own articulation, and joint 2's torque reacts back onto link 1.
 *
 * Generalized coordinates: q = (x, th1, th2). Positions (y DOWN positive):
 *   cart   = (x, 0)
 *   bob1   = (x + L1 s1,            L1 c1)
 *   bob2   = (x + L1 s1 + L2 s2,    L1 c1 + L2 c2)
 * with s1=sin th1, c1=cos th1, etc. (here "down" is +y for the height term, so
 * potential energy uses -m g (L c) with PE minimum hanging down — see energy()).
 *
 * The Euler-Lagrange equations give a symmetric 3x3 mass matrix A(q) times the
 * acceleration vector qdd, equal to a right-hand side b(q, qd, F). We assemble
 * A and b in closed form (derived from the Lagrangian) and solve the 3x3 system
 * each step by Gaussian elimination, then integrate with classic RK4.
 *
 * Derivation summary (standard; see e.g. any analytical-mechanics text):
 *   Let g = gravity. With bobs m1, m2, cart M:
 *
 *   A = [ M+m1+m2          (m1+m2)L1 c1      m2 L2 c2     ]
 *       [ (m1+m2)L1 c1     (m1+m2)L1^2       m2 L1 L2 cos(th1-th2) ]
 *       [ m2 L2 c2         m2 L1 L2 cos(th1-th2)   m2 L2^2 ]
 *
 *   b = [ F - cR x' + (m1+m2)L1 s1 om1^2 + m2 L2 s2 om2^2
 *       , -(m1+m2) g L1 s1 - m2 L1 L2 sin(th1-th2) om2^2 + Q_th1
 *       , -m2 g L2 s2       + m2 L1 L2 sin(th1-th2) om1^2 + Q_th2 ]
 *
 * The cross terms use (th1 - th2) because both angles are referenced to the
 * same vertical. A is symmetric and positive-definite for positive masses, so
 * the solve is always well posed.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod; // Node (CJS)
  root.DoublePendulumPhysics = mod;                                          // browser global
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /** Solve the 3x3 symmetric linear system A z = b in place (Gaussian elim with
   *  partial pivoting). A is a 3x3 array of rows; b is length-3. Returns z. */
  function solve3(A, b) {
    // Work on copies so callers' arrays are untouched.
    const M = [A[0].slice(), A[1].slice(), A[2].slice()];
    const r = b.slice();
    for (let col = 0; col < 3; col++) {
      // partial pivot
      let piv = col;
      for (let i = col + 1; i < 3; i++) if (Math.abs(M[i][col]) > Math.abs(M[piv][col])) piv = i;
      if (piv !== col) { const t = M[piv]; M[piv] = M[col]; M[col] = t; const tr = r[piv]; r[piv] = r[col]; r[col] = tr; }
      const d = M[col][col];
      for (let i = col + 1; i < 3; i++) {
        const f = M[i][col] / d;
        for (let j = col; j < 3; j++) M[i][j] -= f * M[col][j];
        r[i] -= f * r[col];
      }
    }
    const z = [0, 0, 0];
    for (let i = 2; i >= 0; i--) {
      let s = r[i];
      for (let j = i + 1; j < 3; j++) s -= M[i][j] * z[j];
      z[i] = s / M[i][i];
    }
    return z;
  }

  /**
   * Compute accelerations (xdd, t1dd, t2dd) for the double-pendulum-on-cart.
   * @param {object} st {x, v, th1, om1, th2, om2}
   * @param {number} F  horizontal motor force on the cart (N)
   * @param {object} P  {M, m1, m2, L1, L2, g, cR, cP}
   * @param {number} RAIL rail half-length (m); Infinity disables the walls.
   */
  function accel(st, F, P, RAIL) {
    const { M, m1, m2, L1, L2, g, cR, cP } = P;
    if (RAIL === undefined) RAIL = Infinity;
    const { x, v, th1, om1, th2, om2 } = st;
    const s1 = Math.sin(th1), c1 = Math.cos(th1);
    const s2 = Math.sin(th2), c2 = Math.cos(th2);
    const d = th1 - th2, cd = Math.cos(d), sd = Math.sin(d);

    // Damping (see header): joint 1 resists om1, joint 2 resists (om2-om1),
    // and joint 2's torque reacts back onto link 1.
    const Q1 = -cP * om1 + cP * (om2 - om1);
    const Q2 = -cP * (om2 - om1);

    const A = [
      [M + m1 + m2,        (m1 + m2) * L1 * c1,        m2 * L2 * c2],
      [(m1 + m2) * L1 * c1, (m1 + m2) * L1 * L1,       m2 * L1 * L2 * cd],
      [m2 * L2 * c2,        m2 * L1 * L2 * cd,         m2 * L2 * L2],
    ];
    const b = [
      F - cR * v + (m1 + m2) * L1 * s1 * om1 * om1 + m2 * L2 * s2 * om2 * om2,
      -(m1 + m2) * g * L1 * s1 - m2 * L1 * L2 * sd * om2 * om2 + Q1,
      -m2 * g * L2 * s2        + m2 * L1 * L2 * sd * om1 * om1 + Q2,
    ];

    let z = solve3(A, b);
    let xdd = z[0];

    // One-sided rail constraint: if pinned against a wall and the free solution
    // pushes further into it, fix xdd = 0 and re-solve the 2x2 angular block.
    if ((x >= RAIL && xdd > 0) || (x <= -RAIL && xdd < 0)) {
      xdd = 0;
      // With xdd pinned, rows 2,3 of A z = b become a 2x2 system in (t1dd,t2dd):
      //   A11 t1dd + A12 t2dd = b1 - A10*0
      //   A21 t1dd + A22 t2dd = b2 - A20*0
      const a11 = A[1][1], a12 = A[1][2], a21 = A[2][1], a22 = A[2][2];
      const r1 = b[1], r2 = b[2];
      const det = a11 * a22 - a12 * a21;
      const t1dd = (r1 * a22 - a12 * r2) / det;
      const t2dd = (a11 * r2 - r1 * a21) / det;
      return { xdd: 0, t1dd, t2dd };
    }

    return { xdd, t1dd: z[1], t2dd: z[2] };
  }

  /**
   * Total mechanical energy (J). PE measured so the minimum is both bobs
   * hanging straight down: bob height below the pivot is L cos(th), so taking
   * "up" as the positive-energy direction PE = -m g (height below pivot)
   * collapses (as in the single-pendulum module) to -m g L cos(th) summed over
   * the chain (bob2 sits L1 cos1 + L2 cos2 below the cart).
   */
  function energy(st, P) {
    const { M, m1, m2, L1, L2, g } = P;
    const { v, th1, om1, th2, om2 } = st;
    const s1 = Math.sin(th1), c1 = Math.cos(th1);
    const s2 = Math.sin(th2), c2 = Math.cos(th2);
    // Velocities (x to the right, y downward positive for position; velocity
    // components below are in standard x-right / "swing" coordinates).
    const b1vx = v + L1 * c1 * om1;
    const b1vy = L1 * s1 * om1;
    const b2vx = v + L1 * c1 * om1 + L2 * c2 * om2;
    const b2vy = L1 * s1 * om1 + L2 * s2 * om2;
    const KE = 0.5 * M * v * v
             + 0.5 * m1 * (b1vx * b1vx + b1vy * b1vy)
             + 0.5 * m2 * (b2vx * b2vx + b2vy * b2vy);
    // Height of each bob below the pivot: bob1 = L1 c1, bob2 = L1 c1 + L2 c2.
    const PE = -m1 * g * (L1 * c1)
             - m2 * g * (L1 * c1 + L2 * c2);
    return KE + PE;
  }

  /** One classic RK4 step. `forceFn(state)->F` lets a controller use the state. */
  function rk4Step(state, P, dt, forceFn, RAIL) {
    const f = (typeof forceFn === 'function') ? forceFn : () => forceFn;
    const deriv = (s) => {
      const F = f(s);
      const a = accel(s, F, P, RAIL);
      return { dx: s.v, dv: a.xdd, dth1: s.om1, dom1: a.t1dd, dth2: s.om2, dom2: a.t2dd, F };
    };
    const add = (s, k, h) => ({
      x: s.x + k.dx * h, v: s.v + k.dv * h,
      th1: s.th1 + k.dth1 * h, om1: s.om1 + k.dom1 * h,
      th2: s.th2 + k.dth2 * h, om2: s.om2 + k.dom2 * h,
    });
    const s = state;
    const k1 = deriv(s);
    const k2 = deriv(add(s, k1, dt / 2));
    const k3 = deriv(add(s, k2, dt / 2));
    const k4 = deriv(add(s, k3, dt));
    return {
      x:   s.x   + dt / 6 * (k1.dx   + 2 * k2.dx   + 2 * k3.dx   + k4.dx),
      v:   s.v   + dt / 6 * (k1.dv   + 2 * k2.dv   + 2 * k3.dv   + k4.dv),
      th1: s.th1 + dt / 6 * (k1.dth1 + 2 * k2.dth1 + 2 * k3.dth1 + k4.dth1),
      om1: s.om1 + dt / 6 * (k1.dom1 + 2 * k2.dom1 + 2 * k3.dom1 + k4.dom1),
      th2: s.th2 + dt / 6 * (k1.dth2 + 2 * k2.dth2 + 2 * k3.dth2 + k4.dth2),
      om2: s.om2 + dt / 6 * (k1.dom2 + 2 * k2.dom2 + 2 * k3.dom2 + k4.dom2),
      F: k1.F,
    };
  }

  return { accel, energy, rk4Step, solve3 };
});
