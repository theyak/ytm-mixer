import { refreshToken } from "./oauth";

function getOptions() {
	const requestOptions = {
		method: "GET",
		headers: {
			"x-ytm-cookie": localStorage.getItem("x-ytm-cookie") || "",
			"x-ytm-user": localStorage.getItem("x-ytm-user") || 0,
			"x-oauth": localStorage.getItem("oauth-token") || "",
		},
	};

	return requestOptions;
}

function postOptions(data) {
	const requestOptions = {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			"x-ytm-cookie": localStorage.getItem("x-ytm-cookie") || "",
			"x-ytm-user": localStorage.getItem("x-ytm-user") || 0,
			"x-oauth": localStorage.getItem("oauth-token") || "",
		},
	};

	return requestOptions;
}

/**
 * Check if cookie values from YouTube Music have been defined.
 *
 * @returns {Boolean}
 */
export function hasYoutubeMusicCookie() {
	let cookie = localStorage.getItem("x-ytm-cookie");
	if (!cookie) {
		return false;
	}

	cookie = cookie.trim();
	if (cookie.length <= 0 || cookie.indexOf("=") < 0) {
		return false;
	}

	if (cookie.indexOf("__Secure-3PAPISID") < 0) {
		return false;
	}

	return true;
}

/**
 * Check if there is an OAuth token available.
 *
 * @returns {Boolean|Object}
 */
export function hasYoutubeOAuth() {
	let token = localStorage.getItem("oauth-token");
	if (!token) {
		return false;
	}

	token = token.trim();
	if (token.length <= 0) {
		return false;
	}

	try {
		const parse = JSON.parse(token);
		if (!parse.access_token || !parse.refresh_token || !parse.expiresAt) {
			return false;
		}
		return parse;
	} catch (err) {
		return false;
	}
}

/**
 * Refresh the OAuth token if needed.
 */
async function refreshOAuthToken() {
	const token = hasYoutubeOAuth();
	if (!token) {
		return;
	}

	if (Date.now() < token.expiresAt - 3600000) {
		return;
	}

	const result = await refreshToken(token.refresh_token);
	localStorage.setItem("oauth-token", JSON.stringify(result));
}

/**
 * Perform a POST request to our API.
 *
 * @param {string} url
 * @param {object} opts
 * @returns {object}
 */
async function post(url, opts) {
	await refreshOAuthToken();

	const response = await fetch(url, postOptions(opts));
	const data = await response.json();
	return data;
}

/**
 * Perform a GET request to our API.
 *
 * @param {string} url
 * @returns {object}
 */
async function get(url) {
	await refreshOAuthToken();

	const response = await fetch(url, getOptions());
	const data = await response.json();
	return data;
}

/**
 * Create a YouTube playlist.
 *
 * @param {string} title
 * @param {string} description
 * @param {string[]} videoIds
 * @return {id: string, name: string}
 */
export async function createPlaylist(title, description = "", videoIds = []) {
	const response = post("/api/playlists/create", {title, description, videoIds});
	return response;
}

/**
 * Add a single track to a playlist.
 *
 * @param {string} playlistId
 * @param {string} videoId
 * @return bool
 */
export async function addTrackToPlaylist(playlistId, videoId) {
	const response = await post(`/api/playlists/add`, {playlistId, videoId});
	return response;
}

/**
 * Add multiple tracks to playlist.
 * Note, YouTube only allows up to 200 tracks to be added at once.
 *
 * @param {String} playlistId
 * @param {String[]} videoIds
 * @return {id: string, title: string, count: int}
 */
export async function addTracksToPlaylist(playlistId, videoIds) {
	const response = await post(`/api/playlists/add`, {playlistId, videoIds});
	return response;
}

/**
 * Get authenticated user's playlists.
 *
 * @return {id: string, title: string}
 */
export async function getPlaylists() {
	const response = await get("/api/playlists");
	return response;
}

/**
 * Get tracks from playlist
 *
 * @param {string} playlistId
 * @param {number} limit
 *
 * @return {id: string, title: string, artists?: any[], album?: {id: string, title: string}}
 */
export async function getTracks(playlistId, limit = 100) {
	try {
		const response = await get(`/api/tracks/${playlistId}?limit=${limit}`);
		return response;
	} catch (err) {
		return [];
	}
}

/**
 * Playlists with more than 100 tracks need to be loaded in batches. This loads
 * the next batch after the previous batch.
 *
 * @param {string} playlistId
 * @param {string} token
 * @returns {continuation: string}
 */
export async function getTrackContinuations(playlistId, token) {
	const response = await get(`/api/tracks/${playlistId}?token=${token}`);
	return response;
}

/**
 * Rate a track (Not implemented)
 *
 * @param {string} videoId
 * @param {string} rating
 * @returns
 */
export async function rateTrack(videoId, rating) {
	const response = await post("/api/tracks/blah", {videoId, rating});
	return response;
}

/**
 * Get YTM Client info. Basically because Netlify seems to be caching this
 * event when trying to clear cache.
 */
export async function getYtmClientInfo() {
	try{
		const response = await get("/api/clientinfo");
		return response;
	} catch (err) {
		return err;
	}
}

/**
 * Get track information
 *
 * @param {string} videoId
 * @returns Object
 */
export async function getSong(videoId) {
	try {
		const response = await get(`/api/track?videoId=${videoId}`);
		return response;
	} catch (err) {
		return [];
	}
}
