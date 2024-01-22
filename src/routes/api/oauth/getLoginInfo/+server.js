/**
 * Get info to generate a login URL for Google OAuth.
 */

import { post } from '$lib/apiutils';

const OAUTH_SCOPE = "https://www.googleapis.com/auth/youtube";
const OAUTH_CODE_URL = "https://www.youtube.com/o/oauth2/device/code";

export async function GET() {
    const code = await post(OAUTH_CODE_URL, { scope: OAUTH_SCOPE });

    code.url = `${code.verification_url}?user_code=${code.user_code}`;

    return new Response(JSON.stringify(code));
}
