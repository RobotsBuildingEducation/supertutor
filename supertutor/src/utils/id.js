export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const time = Date.now().toString(16);
  const random = Math.random().toString(16).slice(2);
  return `${time}-${random}`;
}
