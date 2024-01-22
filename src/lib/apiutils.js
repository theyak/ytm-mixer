import fetch from 'node-fetch';

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/119.0";
const OAUTH_CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";

/**
 * Make a POST request to remote URL.
 *
 * @param {string} url
 * @param {object} data
 */
export async function post(url, data) {
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
