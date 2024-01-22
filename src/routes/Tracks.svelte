<style lang="postcss">
	th,
	td {
		text-align: left;
		margin-top: 8px;
	}
	td.duration,
	th.duration {
		text-align: right;
	}
	th {
		margin-top: 0;
		user-select: none;
		cursor: pointer;
	}
	td {
		cursor: pointer;
		height: 48px;
		min-height: 48px;
		vertical-align: middle;
	}
	tr.playing td {
		font-weight: bold;
		background-color: rgba(0, 0, 0, .05);
	}

	@media (prefers-color-scheme: dark) {
		tr.playing td {
			background-color: rgba(255, 255, 255, .05);
		}
	}
</style>

<script>
	import * as YTM from '$lib/ytm.js';
	import { queue, currentTrack } from "$lib/stores.js";
	import SvgIcon from "$lib/components/SvgIcon.svelte";
	import Artists from "$lib/components/Artists.svelte";

	export let tracks = [];

	let sortType = '';
	let sortAscending = false;

	function trackSort(type) {
		if (type === sortType) {
			sortAscending = !sortAscending;
		} else {
			sortAscending = true;
		}
		sortType = type;

		if (type === 'title') {
			if (sortAscending) {
				tracks.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
			} else {
				tracks.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1));
			}
		} else if (type === 'duration') {
			if (sortAscending) {
				tracks.sort((a, b) => (a.durationSeconds > b.durationSeconds ? 1 : -1));
			} else {
				tracks.sort((a, b) => (a.durationSeconds < b.durationSeconds ? 1 : -1));
			}
		} else if (type === 'artist') {
			tracks.sort((a, b) => {
				a = a.artists.length > 0 ? a.artists[0].name.toLowerCase() : '';
				b = b.artists.length > 0 ? b.artists[0].name.toLowerCase() : '';
				if (sortAscending) {
					return a > b ? 1 : -1;
				} else {
					return a < b ? 1 : -1;
				}
			});
		} else if (type === 'album') {
			tracks.sort((a, b) => {
				a = a.album ? a.album.name.toLowerCase() : '';
				b = b.album ? b.album.name.toLowerCase() : '';
				if (sortAscending) {
					return a > b ? 1 : -1;
				} else {
					return a < b ? 1 : -1;
				}
			});
		}

		tracks = tracks;
	}

	export let onSelect = (videoId) => {
		$queue = [];

		let found = false;
		for (let track of tracks) {
			if (track.videoId === videoId) {
				found = true;
			}

			if (found) {
				$queue.push(track);
			}
		}

		found = false;
		for (let track of tracks) {
			if (track.videoId === videoId) {
				found = true;
			}

			if (!found) {
				$queue.push(track);
			}
		}

		$currentTrack = $queue[0];
	};

	async function dislike(videoId) {
		await YTM.rateTrack(videoId, "DISLIKE");
	}

	async function like(videoId) {
		await YTM.rateTrack(videoId, "LIKE");
	}

	async function indifferent(videoId) {
		await YTM.rateTrack(videoId, "INDIFFERENT");
	}
</script>

<div class="h-full max-h-full flex-grow overflow-auto scroller p-2">
	{#if tracks.length > 0}
		<table class="w-full">
			<thead>
				<tr>
					<th style="width:40px"></th>
					<th class="w-6"></th>
					<th on:click={() => trackSort('title')}> Title </th>
					<th on:click={() => trackSort('artist')}> Artist </th>
					<th on:click={() => trackSort('album')}> Album </th>
					<th></th>
					<th class="pr-2 duration" on:click={() => trackSort('duration')}> Duration </th>
				</tr>
			</thead>
			<tbody>
				{#each tracks as track, idx}
					<tr on:click={() => onSelect(track.videoId)} class:playing={$currentTrack?.videoId === track.videoId}>
						<td>
							<img style="object-fit:cover;width:40px;height:40px" src={track.thumbnails[0].url} alt="" />
						</td>
						<td class="w-6">
							{#if $currentTrack?.videoId === track.videoId}
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-6 h-6 fill-gray-900 dark:fill-gray-100"><path d="M10.296 7.71 14.621 12l-4.325 4.29 1.408 1.42L17.461 12l-5.757-5.71z"></path><path d="M6.704 6.29 5.296 7.71 9.621 12l-4.325 4.29 1.408 1.42L12.461 12z"></path></svg>
							{/if}
						</td>
						<td class="align-text-top">
							{track.title}
						</td>
						{#if track.artists.length > 0}
							<td class="align-text-top">
								<Artists artists={track.artists} />
							</td>
						{:else}
							<td />
						{/if}
						{#if track.album}
							<td class="align-text-top">{track.album.name}</td>
						{:else}
							<td />
						{/if}

						{#if track.likeStatus === "LIKE"}
							<td>
								<SvgIcon>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
								</SvgIcon>
							</td>
						{:else if track.likeStatus === "DISLIKE"}
							<td>
								<SvgIcon>
									<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
								</SvgIcon>
							</td>
						{:else}
							<td></td>
						{/if}

						<td class="pr-2 duration">{track.duration}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>