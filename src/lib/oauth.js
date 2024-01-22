/**
 * Determine if authorization headers are valid for OAuth authentication
 *
 * @param {object}
 * @return {bool} True if headers are valid, false otherwise
 */
export function is_oauth(headers) {
    if (typeof headers !== "object") {
        return false;
    }

    const oauth_structure = [
        "access_token",
        "expires_at",
        "expires_in",
        "token_type",
        "refresh_token",
    ];

    // Check that headers contain each property in oauth_structure
    for (const property in oauth_structure) {
        if (!headers[property]) {
            return false;
        }
    }

    return true;
}

/**
 * Checks whether the headers contain a Bearer token, indicating a custom OAuth implementation.
 *
 * @param {object}
 * @return {bool}
 */
export function is_custom_oauth(headers) {
    if (typeof headers !== "object") {
        return false;
    }

    return headers["authorization"] && headers.authorization.startsWith("Bearer ");
}

/**
 * Do the OAuth flow and write token data to file
 *
 * @param {string} $filepath
 * @param {bool} $open_browser (Unused in PHP - Sorry :( )
 * @return {object}
 */
export async function getLoginCodes() {
    const response = await fetch(`/api/oauth/getLoginInfo`, { method: "GET" });
	const data = await response.json();
	return data;
}

/**
 * Get token data. This is called after the user has logged in to YouTube Music.
 *
 * @returns {object}
 */
export async function getTokenFromCode(code) {
    const response = await fetch(`/api/oauth/getToken?device_code=${code}`, { method: "GET" });
    const data = await response.json();
    return data;
}
