/** Cross-platform share helpers. Instagram has no reliable web intent — use copy + native share. */

export function openUrl(url: string) {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function shareWhatsApp(text: string) {
  openUrl("https://wa.me/?text=" + encodeURIComponent(text));
}

export function shareX(text: string) {
  openUrl("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text));
}

export function shareFacebook(url: string) {
  openUrl(
    "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)
  );
}

export function shareLinkedIn(url: string) {
  openUrl(
    "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url)
  );
}

export async function shareNative(opts: {
  title: string;
  text: string;
  url: string;
}): Promise<"shared" | "copied" | "cancelled"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
      });
      return "shared";
    } catch {
      return "cancelled";
    }
  }
  try {
    await navigator.clipboard.writeText(`${opts.text}\n\n${opts.url}`);
    return "copied";
  } catch {
    return "cancelled";
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
