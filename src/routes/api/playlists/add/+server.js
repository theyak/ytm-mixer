import {getAuth} from "$lib/ytm.server";

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
	let tracks = [];

	const data = await request.json();

	if (data.videoId) {
		tracks.push(data.videoId);
	} else {
		tracks = data.videoIds;
	}

	const ytma = await getAuth(request.headers);

	const result = await ytma.addPlaylistItems(data.playlistId, tracks);

	return new Response(JSON.stringify(result));
}