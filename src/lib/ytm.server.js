import { YtmClient } from "ytmclient";

export async function getAuth(headers) {
	const cookie = headers.get("x-ytm-cookie");
	const user = headers.get("x-ytm-user");
	const token = headers.get("x-oauth");

	let ytma;

	if (token) {
		// TODO: Refresh token if near or after expire
		ytma = new YtmClient(JSON.parse(token));
	} else if (cookie) {
		ytma = new YtmClient(cookie, user);
		if (!ytma.sapiSid) {
			throw new Error("Invalid cookie value.");
		}
	}

	return ytma;
}
