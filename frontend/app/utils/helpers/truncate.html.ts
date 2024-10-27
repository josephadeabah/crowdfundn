export function truncateHTML(html: string, wordLimit: number): string {
  // Ensure DOMParser is only used in the browser
  if (typeof window !== 'undefined') {
    const textContent =
      new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
    const words = textContent.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : textContent;
  }
  // Fallback if `DOMParser` is not available (e.g., server-side)
  const plainText = html.replace(/<\/?[^>]+(>|$)/g, ''); // Strip HTML tags
  const words = plainText.split(' ');
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : plainText;
}
