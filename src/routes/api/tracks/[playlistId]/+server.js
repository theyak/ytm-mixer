import {getAuth} from "$lib/ytm.server";
// import * as util from "util";

/** @type {import('./$types').RequestHandler} */
export async function GET({request, params}) {
	const url = new URL(request.url);
	const limit = url.searchParams.get("limit") || 0;
	const continuation = url.searchParams.get("token") || null;

	try {
		const ytma = await getAuth(request.headers);

		if (continuation) {
			const playlist = await ytma.getPlaylistContinuations(params.playlistId, continuation);
			return new Response(JSON.stringify(playlist));
		} else {
			const playlist = await ytma.getPlaylist(params.playlistId, limit);
			return new Response(JSON.stringify(playlist));
		}
	} catch (err) {
		return new Response(JSON.stringify({error: err.message}));
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
	const data = await request.json();
	const videoId = data.videoId;
	const rating = data.rating;

	const ytma = await getAuth(request.headers);
	const result = await ytma.rateTrack(videoId, rating);

	return new Response(JSON.stringify(result));
}
