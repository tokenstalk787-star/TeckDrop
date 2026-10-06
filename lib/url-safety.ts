export function validateExternalUrl(value: string | null, label: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") throw new Error(label + " must use HTTPS.");
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local")) {
      throw new Error(label + " cannot point to a local host.");
    }
    return url.toString();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(label)) throw error;
    throw new Error(label + " must be a valid HTTPS URL.");
  }
}
