/**
 * Create a new OAuth token.
 *
 * Call after logging in to Google and getting a device code.
 */

import { post } from '$lib/apiutils';

const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const OAUTH_CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";

export async function GET({request}) {
    const url = new URL(request.url);
	const deviceCode = url.searchParams.get("device_code");

    if (!deviceCode) {
        return new Response(JSON.stringify({
            error: "device_code is required",
        }), { status: 400 });
    }

    const response = await post(OAUTH_TOKEN_URL, {
        "client_secret": OAUTH_CLIENT_SECRET,
        "grant_type": "http://oauth.net/grant_type/device/1.0",
        "code": deviceCode,
    });

    if (response.error) {
        return new Response(JSON.stringify(response), { status: 400 });
    }

    response.expiresAt = Date.now() + (response.expires_in * 1000);

    return new Response(JSON.stringify(response));
}
