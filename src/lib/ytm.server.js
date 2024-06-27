import { YtmClient } from "ytmclient";

export async function getAuth(headers) {
	const token = headers.get("x-oauth");

	if (token) {
		try {
			const parse = JSON.parse(token);
			if (!parse || !parse.access_token || !parse.refresh_token || !parse.expiresAt) {
				return new YtmClient();
			}
			return new YtmClient(parse);
		} catch {
			throw new Error("Invalid token value.");
		}
	} else {
		return new YtmClient();
	}
}
