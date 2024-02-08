import { YtmClient } from "ytmclient";

export async function getAuth(headers) {
	const cookie = headers.get("x-ytm-cookie");
	const user = headers.get("x-ytm-user");
	const token = headers.get("x-oauth");

	let ytma;

	if (token) {
		try {
			const parse = JSON.parse(token);
			if (!parse || !parse.access_token || !parse.refresh_token || !parse.expiresAt) {
				throw new Error("Invalid token value.");
			}
			ytma = new YtmClient(parse);
		} catch {
			throw new Error("Invalid token value.");
		}
	} else if (cookie) {
		ytma = new YtmClient(cookie, user);
		if (!ytma.sapiSid) {
			throw new Error("Invalid cookie value.");
		}
	}

	return ytma;
}
