// Illustrative mechanism geometry, independent of the learner's robot and evidence.
const mix = (a, b, t) => a.map((n, i) => n + (b[i] - n) * t);
const smooth = (t) => t * t * (3 - 2 * t);
export const distance3 = (a, b) => Math.hypot(...a.map((n, i) => n - b[i]));
function elbow2(a, b, l1, l2, side = 1) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    d = Math.hypot(dx, dy);
  const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d),
    h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  return [
    a[0] + (along * dx) / d - (side * h * dy) / d,
    a[1] + (along * dy) / d + (side * h * dx) / d,
  ];
}
export function robotTypePose(type, progress) {
  const t = Math.max(0, Math.min(1, progress)),
    phase = Math.min(3, Math.floor(t * 4));
  const u = t === 1 ? 1 : smooth((t * 4) % 1);
  if (type === "mobile") {
    const tip =
      phase === 0
        ? mix([-85, 0, 65], [70, 0, 65], u)
        : phase === 1
          ? [70, 0, 65]
          : phase === 2
            ? mix([70, 0, 65], [70, 0, -65], u)
            : [70, 0, -65];
    const heading =
      phase === 0
        ? 0
        : phase === 1
          ? (u * Math.PI) / 2
          : phase === 2
            ? Math.PI / 2
            : ((1 - u) * Math.PI) / 2;
    return {
      type,
      t,
      phase,
      tip,
      heading,
      source: [-85, 0, 65],
      destination: [70, 0, -65],
    };
  }
  if (type === "cartesian") {
    const corners = [
      [-65, 10, 45],
      [65, 10, 45],
      [65, 10, -45],
      [-65, 10, -45],
      [-65, 10, 45],
    ];
    return {
      type,
      t,
      phase,
      tip: mix(corners[phase], corners[phase + 1], u),
      corners,
    };
  }
  const source =
    type === "delta"
      ? [-40, 30, 35]
      : type === "scara"
        ? [75, 18, 55]
        : [110, 18, 55];
  const destination =
    type === "delta"
      ? [40, 30, -35]
      : type === "scara"
        ? [105, 18, -55]
        : [95, 18, -65];
  let tip;
  if (phase === 0) {
    tip = [...source];
    tip[1] += 20 * (1 - Math.min(1, u / 0.65));
  } else if (phase === 1) {
    tip = mix(source, destination, u);
    tip[1] += 40 * Math.sin(Math.PI * u);
  } else if (phase === 2) tip = [...destination];
  else {
    tip = mix(destination, source, u);
    tip[1] += 40 * Math.sin(Math.PI * u) + 20 * u;
  }
  const gap =
    phase === 0
      ? 17 - 7 * Math.max(0, (u - 0.65) / 0.35)
      : phase === 1
        ? 10
        : phase === 2
          ? 10 + 7 * u
          : 17;
  const pose = {
    type,
    t,
    phase,
    tip,
    source,
    destination,
    gap,
    held: phase === 1,
    object: phase < 1 ? source : phase === 1 ? tip : destination,
  };
  if (type === "articulated") {
    const yaw = Math.atan2(tip[2], tip[0]),
      r = Math.hypot(tip[0], tip[2]);
    const joint = elbow2([0, 60], [r, tip[1]], 80, 70);
    pose.base = [0, 60, 0];
    pose.joint = [joint[0] * Math.cos(yaw), joint[1], joint[0] * Math.sin(yaw)];
    pose.yaw = yaw;
  } else if (type === "scara") {
    const j = elbow2([-40, 0], [tip[0], tip[2]], 95, 80);
    pose.base = [-40, 100, 0];
    pose.joint = [j[0], 100, j[1]];
  } else {
    // Three driven upper links rotate in radial/vertical planes. Paired lower
    // rods connect them to one level platform; this is a kinematic illustration.
    pose.chains = [0, 1, 2].map((i) => {
      const angle = (i * Math.PI * 2) / 3,
        c = Math.cos(angle),
        s = Math.sin(angle);
      const a = [100 * c, 160, 100 * s],
        e = [tip[0] + 22 * c, tip[1] + 15, tip[2] + 22 * s];
      const tangent = -e[0] * s + e[2] * c;
      const joint = elbow2(
        [100, 160],
        [e[0] * c + e[2] * s, e[1]],
        75,
        Math.sqrt(125 ** 2 - tangent ** 2),
      );
      return {
        a,
        b: [joint[0] * c, joint[1], joint[0] * s],
        e,
        tangent: [-s, 0, c],
      };
    });
  }
  return pose;
}
