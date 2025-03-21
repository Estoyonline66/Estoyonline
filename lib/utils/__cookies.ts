import Cookies from 'js-cookie';

/**
 * Sets a cookie with the specified name, value, and options.
 * 
 * @param {string} cookieName - The name of the cookie to set.
 * @param {string} cookieValue - The value of the cookie to set.
 * @param {Cookies.CookieAttributes} [options] - Optional attributes for the cookie (e.g., expires, path, domain, secure).
 * @returns {string | undefined} - The cookie value if the cookie was set successfully, otherwise undefined.
 */
export function setCookie(cookieName: string, cookieValue: string, options?: Cookies.CookieAttributes): string | undefined {
    const cookieResponse = Cookies.set(cookieName, cookieValue, options);
    return cookieResponse;
}

/**
 * Retrieves the value of the cookie with the specified name.
 * 
 * @param {string} cookieName - The name of the cookie to retrieve.
 * @returns {string | undefined} - The value of the cookie if it exists, otherwise undefined.
 */
export function getCookie(cookieName: string): string | undefined {
    const cookieResponse = Cookies.get(cookieName);
    return cookieResponse;
}

/**
 * Removes the cookie with the specified name and options.
 * 
 * @param {string} cookieName - The name of the cookie to remove.
 * @param {Cookies.CookieAttributes} [options] - Optional attributes for the cookie (e.g., path, domain).
 * @returns {void}
 */
export function removeCookie(cookieName: string, options?: Cookies.CookieAttributes): void {
    Cookies.remove(cookieName, options);
}