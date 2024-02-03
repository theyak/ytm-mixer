import fetch from 'node-fetch';

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/119.0";
const OAUTH_CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
const OAUTH_SCOPE = "https://www.googleapis.com/auth/youtube";
const OAUTH_CODE_URL = "https://www.youtube.com/o/oauth2/device/code";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const OAUTH_CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";

/**
 * Make a POST request to remote URL.
 *
 * @param {string} url
 * @param {object} data
 */
async function post(url, data) {
    data.client_id = OAUTH_CLIENT_ID;
    const response = await fetch(url, {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            "User-Agent": USER_AGENT,
            "Content-Type": "application/json"
        },
    });

    const result = await response.json();

    return result;
}

async function getToken(url) {
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

    response.poop = "hiu";
    if (response.error) {
        return new Response(JSON.stringify(response), { status: 400 });
    }

    response.expiresAt = Date.now() + (response.expires_in * 1000);

    return new Response(JSON.stringify(response));
}

async function getUrl() {
    const code = await post(OAUTH_CODE_URL, { scope: OAUTH_SCOPE });
    code.url = `${code.verification_url}?user_code=${code.user_code}`;
    return new Response(JSON.stringify(code));
}

/**
 * Refresh token
 * @param {string} The refresh token from the original token request
 * @returns
 */
async function refreshToken(url) {
    const token = url.searchParams.get("token");
    const response = await post(OAUTH_TOKEN_URL, {
        "client_secret": OAUTH_CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": token
    });

    if (response.error) {
        return new Response(JSON.stringify(response), { status: 400 });
    }

    token.access_token = response.access_token;
    token.expiresAt = Date.now() + (response.expires_in * 1000);

    return new Response(JSON.stringify(token));
}

export async function GET({params, url}) {
    console.log(params, url);
    if (params.action === "get-url") {
        return getUrl();
    } else if (params.action === "get-token") {
        return getToken(url);
    } else if (params.action === "refresh-token") {
        return refreshToken(url);
    }
}

export async function POST({params}) {
    return new Response(JSON.stringify({
        error: "Not implemented", params
    }), { status: 501 });
}
