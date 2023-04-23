export function getCookie(name: string): string | null {
  if (!document.cookie) {
    return null;
  }

  const xsrfCookies = document.cookie
    .split(';')
    .map((c) => c.trim())
    .filter((c) => c.startsWith(`${name}=`));

  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}

/**
 * Creates a string format for provided date.
 * @param {String} date Date string
 * @returns {String} Returns a formatted string of the format of M-D-Y
 */
export function dateToText(date: string) {
  const createdDate = new Date(date);

  // eslint-disable-next-line no-restricted-globals
  return !isNaN(createdDate as any)
    ? `${createdDate.toLocaleDateString('default', {
        month: 'short',
      })} ${createdDate.getDate()}, ${createdDate.getFullYear()}`
    : '';
}
