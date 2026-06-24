/*
 * Cart-pendulum physics — shared by the live simulation (pendulum.html),
 * the training rollouts, and the test suite (tests/).
 *
 * Convention: theta is measured from straight DOWN (theta = 0 is the bob
 * hanging at rest below the pivot). x is the cart position along the rail.
 *
 * Equations of motion (massless rigid rod, point bob mass m, cart mass M,
 * horizontal motor force F on the cart, viscous rail damping cR on the cart,
 * viscous pivot damping cP on the pendulum angular coordinate):
 *
 *   (M + m) x'' + m L cos(th) th'' - m L sin(th) om^2 = F - cR x'      (cart)
 *   cos(th) x''  + L th''         + g sin(th)         = -cP om          (pendulum)
 *
 * These are the standard Lagrangian equations for a cart-pendulum. They are
 * COUPLED in x'' and th'': pivot damping influences the cart and vice versa.
 * We therefore solve the 2x2 linear system exactly each step rather than
 * computing x'' first and substituting (which would drop the damping coupling).
 *
 * Rail constraint: the cart cannot accelerate past a hard wall at +/-RAIL.
 * When pressed against a wall and the unconstrained x'' points outward, we
 * pin x'' = 0 and re-solve th'' from the pendulum equation with x'' fixed —
 * the proper treatment of a one-sided holonomic constraint.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod; // Node (CJS)
  root.PendulumPhysics = mod;                                                // browser global
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * Compute (x'', th'') for the cart-pendulum at the given state.
   * @param {number} th  pendulum angle from down (rad)
   * @param {number} om  angular velocity th' (rad/s)
   * @param {number} xs  cart position (m)
   * @param {number} vs  cart velocity x' (m/s)
   * @param {number} F   horizontal motor force on cart (N)
   * @param {object} P   {M, m, L, g, cR, cP}
   * @param {number} RAIL  rail half-length (m); use Infinity to disable walls
   */
  function accel(th, om, xs, vs, F, P, RAIL) {
    const { M, m, L, g, cR, cP } = P;
    if (RAIL === undefined) RAIL = Infinity;
    const s = Math.sin(th), c = Math.cos(th);

    // Linear system  A [x''; th''] = b  with
    //   A = [ (M+m)   m L c ;  c   L ]
    //   b = [ F - cR vs + m L s om^2 ;  -g s - cP om ]
    const a11 = M + m, a12 = m * L * c;
    const a21 = c,      a22 = L;
    const r1 = F - cR * vs + m * L * s * om * om;
    const r2 = -g * s - cP * om;
    const det = a11 * a22 - a12 * a21;       // = (M+m)L - m L c^2 = L (M + m sin^2 th) > 0

    let xdd = (r1 * a22 - a12 * r2) / det;

    // One-sided rail constraint.
    if ((xs >= RAIL && xdd > 0) || (xs <= -RAIL && xdd < 0)) {
      xdd = 0;
      const tdd = -(g * s + cP * om) / L;    // pendulum eq with x'' pinned to 0
      return { xdd, tdd };
    }

    const tdd = (a11 * r2 - r1 * a21) / det;
    return { xdd, tdd };
  }

  /**
   * Total mechanical energy (J). Potential zero at the pivot; the bob's
   * height relative to the pivot is -L cos(th) (theta from down), so PE has
   * its minimum when the bob hangs straight down.
   */
  function energy(th, om, xs, vs, P) {
    const { M, m, L, g } = P;
    // Bob velocity: bob = (xs + L sin th, -L cos th)
    const bvx = vs + L * Math.cos(th) * om;
    const bvy = L * Math.sin(th) * om;
    const KE = 0.5 * M * vs * vs + 0.5 * m * (bvx * bvx + bvy * bvy);
    const PE = -m * g * L * Math.cos(th);
    return KE + PE;
  }

  /** One classic RK4 step. `forceFn(state) -> F` lets the controller depend on state. */
  function rk4Step(state, P, dt, forceFn, RAIL) {
    const f = (typeof forceFn === 'function') ? forceFn : () => forceFn;
    const d = (st) => {
      const F = f(st);
      const a = accel(st.theta, st.omega, st.x, st.v, F, P, RAIL);
      return { dx: st.v, dv: a.xdd, dth: st.omega, dom: a.tdd, F };
    };
    const s = state;
    const k1 = d(s);
    const s2 = { x:s.x+k1.dx*dt/2, v:s.v+k1.dv*dt/2, theta:s.theta+k1.dth*dt/2, omega:s.omega+k1.dom*dt/2 };
    const k2 = d(s2);
    const s3 = { x:s.x+k2.dx*dt/2, v:s.v+k2.dv*dt/2, theta:s.theta+k2.dth*dt/2, omega:s.omega+k2.dom*dt/2 };
    const k3 = d(s3);
    const s4 = { x:s.x+k3.dx*dt, v:s.v+k3.dv*dt, theta:s.theta+k3.dth*dt, omega:s.omega+k3.dom*dt };
    const k4 = d(s4);
    return {
      x:     s.x     + dt/6 * (k1.dx  + 2*k2.dx  + 2*k3.dx  + k4.dx),
      v:     s.v     + dt/6 * (k1.dv  + 2*k2.dv  + 2*k3.dv  + k4.dv),
      theta: s.theta + dt/6 * (k1.dth + 2*k2.dth + 2*k3.dth + k4.dth),
      omega: s.omega + dt/6 * (k1.dom + 2*k2.dom + 2*k3.dom + k4.dom),
      F: k1.F,
    };
  }

  return { accel, energy, rk4Step };
});
