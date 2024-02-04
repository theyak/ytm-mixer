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
		console.log(error);
		const message = JSON.parse(error.message);
		return new Response(JSON.stringify({error: message}), {status: message.code});
	}
}
