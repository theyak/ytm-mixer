<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { login, progress, isLoggedIn } from '$lib/stores';
	import * as YTM from '$lib/ytm.js';
	import Tracks from '../Tracks.svelte';
	import SaveModal from '$lib/components/SaveModal.svelte';
	import LoginModal from '$lib/components/LoginModal.svelte';

	let canContinue = true;

	let playlist = null;

	let saveModal = false;

	$: $page.params.playlistId, (() => {
		canContinue = false;
		playlist = null;
		loadTracks($page.params.playlistId);
	})()

	onMount(async () => {
		if (!YTM.hasYoutubeMusicCookie()) {
			$login = true;
			return;
		}
	});

	/**
	 * Load tracks from playlist
	 *
	 * @param {string} Playlist ID
	 */
	async function loadTracks(id, refresh = false) {

		if (!refresh && sessionStorage.getItem(`playlist-${id}`)) {
			playlist = JSON.parse(sessionStorage.getItem(`playlist-${id}`));
			return;
		}

		let requests = 1;

		playlist = await YTM.getTracks(id, 100);

		if (playlist.error) {
			playlist = {
				id: $page.params.playlistId,
				tracks: [],
			};

			return;
		}

		let continuation = playlist.continuation;
		if (continuation) {
			canContinue = true;
		}

		const trackCount = playlist.trackCount;
		const maxRequests = Math.ceil(trackCount / 100);

		while (playlist && canContinue && continuation && requests < maxRequests) {
			const next = await YTM.getTrackContinuations(id, continuation);
			if (playlist && canContinue) {
				requests++;
				$progress = (requests / maxRequests) * 100;
				playlist.tracks = [...playlist.tracks, ...next.tracks];
				continuation = next.continuation;
			}
		}

		const duration = playlist.tracks.reduce((prev, curr) => {
			return prev + curr.durationSeconds;
		}, 0);

		playlist.duration = convertSecondsToFullTime(duration);

		sessionStorage.setItem(`playlist-${id}`, JSON.stringify(playlist));
	}

	/**
	 * Convert number of seconds to a playlist duration string similar
	 * to what is showin in YouTube Music. For example, 3 hours, 20 minutes
	 * or 45 minutes, 10 seconds.
	 *
	 * @param {number}
	 * @return {string}
	 */
	function convertSecondsToFullTime(seconds) {

		// Calculate hours, minutes, and seconds
		seconds = Math.floor(seconds);
		let hours = Math.floor(seconds / 3600);
		let minutes = Math.floor((seconds % 3600) / 60);
		seconds = seconds % 60;

		const hoursLabel = hours === 1 ? "hour" : "hours";
		const minutesLabel = minutes === 1 ? "minute" : "minutes";
		const secondsLabel = seconds === 1 ? "second" : "seconds";

		// Create the formatted time string
		if (hours > 0) {
			return `${hours} ${hoursLabel}, ${minutes} ${minutesLabel}`;
		}

		return `${minutes} ${minutesLabel}, ${seconds} ${secondsLabel}`;

	}

	/**
	 * Shuffle an array
	 *
	 * @param {array}
	 * @return {array}
	 */
	function shuffle(arr) {
		let newArr = arr.slice();
		for (let i = newArr.length - 1; i > 0; i--) {
			const rand = Math.floor(Math.random() * (i + 1));
			[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
		}
		return newArr;
	}

	/**
	 * Randomly shuffle tracks. No magic algorithm needed.
	 */
	function shuffleTracks() {
		for (let i = 0; i < 5; i++) {
			playlist.tracks = shuffle(playlist.tracks);
		}
	}


	/**
	 * Save playlist to YouTube Music
	 *
	 * @param {CustomEvent}
	 */
	async function createPlaylist(e) {
		const name = e.detail.name;

		if (name) {
			const response = await YTM.createPlaylist(name);
			if (response.success) {
				const playlistId = response.playlistId;

				// Get IDs of tracks, removing any duplicates which will
				// cause an error when trying to add tracks. Duplicates
				// generally come from automatically generated playlists
				// such as Liked Music.
				const idSet = new Set();
				for (let i in playlist.tracks) {
					const id = playlist.tracks[i].videoId;
					if (idSet.has(id)) {
						const title = playlist.tracks[i].title;
						console.log(`Playlist has duplicate track ${id} - ${title}. Skipping.`);
					} else {
						idSet.add(id);
					}
				}

				const ids = Array.from(idSet);

				// There is a maximum of 200 tracks that can be saved at a time
				const chunkSize = 200;
				for (let i = 0; i < ids.length; i += chunkSize) {
					const chunk = ids.slice(i, i + chunkSize);
					await YTM.addTracksToPlaylist(playlistId, chunk);
				}
			} else {
				alert(response.error);
			}
		}
	}
</script>

<LoginModal on:login={() => loadTracks($page.params.playlistId)} />
<SaveModal open={saveModal} on:close={saveModal = false} on:save={createPlaylist}/>

<div class="overflow-y-auto scroller">
	<div class="m-4 mb-24">
		{#if playlist}
			{#if playlist.title}
				<div class="flex justify-between">
					<div class="flex flex-row gap-4 items-center">
						{#if playlist.thumbnails}
							<img src={playlist.thumbnails[0].url} alt="Playlist thumbnail" style={`width: ${playlist.thumbnails[0].width}px; height: ${playlist.thumbnails[0].height}px`} />
						{/if}
						<div>
							<div class="text-4xl mb-4">{playlist.title}</div>
							<div>{playlist.tracks.length} Songs</div>
							<div>{playlist.description || ""}</div>
							{#if playlist.duration}
								<div>Duration: {playlist.duration}</div>
							{/if}
							{#if playlist.author?.name}
								<div>Author: {playlist.author.name}</div>
							{/if}
							{#if playlist.year}
								<div>Year: {playlist.year}</div>
							{/if}
						</div>
					</div>
					<div>
						<button class="px-4 py-1 mr-3 border-solid dark:border-gray-100 border-gray-900 border" on:click={shuffleTracks}>Shuffle</button>
						{#if $isLoggedIn}
							<button class="px-4 py-1 mr-3 border-solid dark:border-gray-100 border-gray-900 border" on:click={() => {saveModal = true}}>Save</button>
						{/if}
						<button class="px-4 py-1 border-solid dark:border-gray-100 border-gray-900 border" on:click={() => loadTracks(playlist.id, true)}>Refresh</button>
					</div>
				</div>
				<Tracks tracks={playlist.tracks} />
			{:else}
				Playlist {playlist.id} has no tracks.
			{/if}
		{:else if $isLoggedIn}
			Loading tracks...
		{/if}
	</div>
</div>
