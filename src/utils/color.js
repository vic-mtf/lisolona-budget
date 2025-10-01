export function hexToRgb(hex) {
  hex = hex.slice(1);

  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  return { r, g, b };
}

export function rgbToHex(r, g, b) {
  let rHex = r.toString(16).padStart(2, "0");
  let gHex = g.toString(16).padStart(2, "0");
  let bHex = b.toString(16).padStart(2, "0");

  let hex = "#" + rHex + gHex + bHex;

  return hex;
}

export function paleColor(color, theme) {
  let rgb;

  if (typeof color === "string" && color.startsWith("#")) rgb = hexToRgb(color);
  else if (
    typeof color === "object" &&
    color.r !== undefined &&
    color.g !== undefined &&
    color.b !== undefined
  )
    rgb = { ...color };

  let factor;

  if (theme === "dark") factor = 0.2;
  else if (theme === "light") factor = 0.8;

  rgb.r = Math.round(rgb.r * factor);
  rgb.g = Math.round(rgb.g * factor);
  rgb.b = Math.round(rgb.b * factor);

  let hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return hex;
}

export function colorFromId(id, mode = "light") {
  const num = parseInt(id?.toString()?.substr(-6), 16);
  let lightness = mode === "light" ? 70 : 30;
  return {
    backgroundColor: `hsl(${num % 360}, 100%, ${lightness}%)`,
    color: `hsl(${num % 360}, 100%, ${lightness - 30}%)`,
  };
}

export function darkGradientFromId(id) {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hslStr = (h, s, l) =>
    `hsl(${Math.round(h)}, ${clamp(Math.round(s), 0, 100)}%, ${clamp(
      Math.round(l),
      0,
      100
    )}%)`;
  const hslaStr = (h, s, l, a) =>
    `hsla(${Math.round(h)}, ${clamp(Math.round(s), 0, 100)}%, ${clamp(
      Math.round(l),
      0,
      100
    )}%, ${a})`;

  const base = colorFromId(id, "light") || {};
  const baseHsl = (base.backgroundColor || "").match(
    /hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i
  );

  if (!baseHsl) {
    return {
      backgroundColor: "#111",
      color: "#eee",
    };
  }

  const H = Number(baseHsl[1]);
  const S = Number(baseHsl[2]);
  const L = Number(baseHsl[3]);

  // 🌑 variantes sombres mais colorées
  const v0 = hslStr(H, clamp(S, 60, 100), clamp(L * 0.4, 15, 35));
  const v1 = hslStr(
    (H + 12) % 360,
    clamp(S - 5, 55, 100),
    clamp(L * 0.32, 12, 30)
  );
  const v2 = hslStr(
    (H - 10 + 360) % 360,
    clamp(S - 10, 50, 95),
    clamp(L * 0.25, 10, 25)
  );
  const v3 = hslStr(
    (H + 20) % 360,
    clamp(S - 15, 45, 90),
    clamp(L * 0.18, 8, 20)
  );

  // dégradés radiaux (subtils)
  const radial1 = `radial-gradient(30% 25% at 20% 25%, ${hslaStr(
    H,
    S,
    L * 0.3,
    0.45
  )}, transparent 50%)`;
  const radial2 = `radial-gradient(25% 22% at 80% 20%, ${hslaStr(
    H + 15,
    S - 10,
    L * 0.25,
    0.4
  )}, transparent 45%)`;
  const radial3 = `radial-gradient(35% 28% at 25% 75%, ${hslaStr(
    H - 15,
    S - 12,
    L * 0.2,
    0.35
  )}, transparent 50%)`;

  // linear principal
  const linear = `linear-gradient(135deg, ${v0} 0%, ${v1} 30%, ${v2} 70%, ${v3} 100%)`;

  return {
    backgroundColor: v3, // fallback
    backgroundImage: [radial1, radial2, radial3, linear].join(", "),
    backgroundBlendMode: "overlay",
    color: base.backgroundColor,
  };
}
