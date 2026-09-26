/** Monday–Sunday week label for field distribution (local calendar date). */
export function weekOfLabel(d: Date = new Date()): {
  label: string;
  range: string;
  iso: string;
} {
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(d.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (x: Date) =>
    x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const short = (x: Date) =>
    x.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return {
    label: `Week of ${short(monday)} – ${fmt(sunday)}`,
    range: `${fmt(monday)} – ${fmt(sunday)}`,
    iso: monday.toISOString().slice(0, 10),
  };
}
