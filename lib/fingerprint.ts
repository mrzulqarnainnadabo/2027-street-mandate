export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  const key = "iseyc_street_mandate_device";
  let id = localStorage.getItem(key);
  if (!id) {
    id = "d_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
}
