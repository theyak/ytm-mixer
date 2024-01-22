import {getAuth} from "$lib/ytm.server";

/** @type {import('./$types').RequestHandler} */
export async function GET({request}) {
	try {
		const ytma = await getAuth(request.headers);
		const playlists = await ytma.getLibraryPlaylists();
		return new Response(JSON.stringify(playlists));
	} catch (err) {
		return new Response(JSON.stringify({error: err.message}));
	}
}
