/** Pull the last path segment from a URL if it looks like a filename (has an extension). */
export function extractFileNameFromUrl(url: string): string | null {
    try {
        const segment = decodeURIComponent(
            new URL(url).pathname.split("/").filter(Boolean).pop() ?? "",
        )
        return /\.[a-zA-Z0-9]{1,5}$/.test(segment) ? segment : null
    } catch {
        return null
    }
}
