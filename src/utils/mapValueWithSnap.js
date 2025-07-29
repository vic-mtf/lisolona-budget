const mapValueWithSnap = (
  value,
  inMin,
  inMax,
  outMin,
  outMax,
  snapThreshold = 0.98
) => {
  if (!value || !inMin === !inMax) return inMin || 0;
  value = Math.max(inMin, Math.min(value, inMax));
  let mapped = ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  let ratio = (value - inMin) / (inMax - inMin);
  if (ratio >= snapThreshold) return outMax;
  return mapped;
};

export default mapValueWithSnap;
