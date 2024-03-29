import {getAuth} from "$lib/ytm.server";

/** @type {import('./$types').RequestHandler} */
export async function GET({request}) {
	try {
		const ytma = await getAuth(request.headers);
		if (ytma) {
			const playlists = await ytma.getLibraryPlaylists();
			return new Response(JSON.stringify(playlists));
		} else {
			throw new Error(JSON.stringify({code: 401, message: "UNAUTHORIZED"}));
		}
	} catch (error) {
		let message = error.message;
		if (error.message.indexOf("{") === 0) {
			try {
				message = JSON.parse(error.message);
			} catch (e) {
				// Do nothing.
			}
		}
		return new Response(JSON.stringify({error: message}), {status: message.code});
	}
}
