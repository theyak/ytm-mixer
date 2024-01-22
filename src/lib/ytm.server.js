import { YtmClient } from "ytmclient";

export async function getAuth(headers) {
	const cookie = headers.get("x-ytm-cookie");
	const user = headers.get("x-ytm-user");

	const ytma = new YtmClient(cookie, user);

	if (!ytma.sapiSid) {
		throw new Error("Invalid cookie value.");
	}

	return ytma;
}
