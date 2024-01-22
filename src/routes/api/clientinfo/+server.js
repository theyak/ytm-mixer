import {getAuth} from "$lib/ytm.server";

/** @type {import('./$types').RequestHandler} */
export async function GET({setHeaders, request}) {

	setHeaders({
		"cache-control": "max-age=30",
	});

	try {
		const ytma = await getAuth(request.headers);
		const clientInfo = await ytma.getDebugInformation();
		return new Response(JSON.stringify(clientInfo));
	} catch (err) {
		return new Response(JSON.stringify({error: err.message}));
	}
}
