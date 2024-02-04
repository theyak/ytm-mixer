import {getAuth} from "$lib/ytm.server";
// import * as util from "util";

/** @type {import('./$types').RequestHandler} */
export async function GET({request}) {
	const url = new URL(request.url);
	const videoId = url.searchParams.get("videoId") || "";

	try {
		const ytma = await getAuth(request.headers);
		const songInfo = await ytma.getSong(videoId);
		return new Response(JSON.stringify(songInfo));
	} catch (err) {
		return new Response(JSON.stringify({error: err.message}));
	}
}
