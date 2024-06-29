import {getAuth} from "$lib/ytm.server";

/** @type {import('./$types').RequestHandler} */
export async function GET({request}) {
	try {
		const ytma = await getAuth(request.headers);
		const account = await ytma.getAccount();
		return new Response(JSON.stringify(account));
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
