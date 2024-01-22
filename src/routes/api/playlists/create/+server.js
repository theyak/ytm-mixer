import {getAuth} from "$lib/ytm.server";

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
	const data = await request.json();
	const ytma = await getAuth(request.headers);

	const result = await ytma.createPlaylist(data.title, data.description, "PRIVATE", data.videoIds);

	return new Response(JSON.stringify(result));
}