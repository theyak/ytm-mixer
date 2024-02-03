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
 * Get the OAuth URL that the user should visit to log in to YouTube Music.
 *
 * @return {object}
 */
export async function getOAuthUrl() {
    const response = await fetch(`/api/oauth/get-url`, { method: "GET" });
	const data = await response.json();
	return data;
}

/**
 * Get token data. This is called after the user has logged in to YouTube Music.
 *
 * @returns {object}
 */
export async function getTokenFromCode(code) {
    const response = await fetch(`/api/oauth/get-token?device_code=${code}`, { method: "GET" });
    const data = await response.json();
    return data;
}

/**
 * Refresh the OAuth token
 *
 * @returns {object}
 */
export async function refreshToken() {
    const response = await fetch(`/api/oauth/refresh-token`, { method: "GET" });
    const data = await response.json();
    return data;
}
