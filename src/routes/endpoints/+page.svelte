<script>
	import * as YTM from '$lib/ytm.js';
	import { Button, Radio, Input, Label } from 'flowbite-svelte';
	import { onMount } from "svelte";

	let api = "tracks";
	let response = "";
	let playlistId = "";
	let history = [];

	onMount(() => {
		const h = localStorage.getItem("api-history");
		if (h) {
			history = JSON.parse(h);

			const item = history[0];
			if (item.api === "tracks") {
				playlistId = item.data.playlistId;
			}
		}
	});

	async function getTracks() {
		const data = await YTM.getTracks(playlistId);
		response = JSON.stringify(data, null, 4);

		// Add to history if request wasn't same as last
		if (history.length <= 0 || history[0].api !== "tracks" || history[0].data.playlistId !== playlistId) {
			history.unshift({"api": "tracks", data:{"playlistId": playlistId, title: response.title}});
			localStorage.setItem("api-history", JSON.stringify(history));
		}
	}
</script>

<div class="p-4 overflow-auto">
	<p class="mb-4 font-semibold">Select API Endpoint</p>
	<div class="flex gap-4">
		<Radio bind:group={api} value="playlists">Playlists</Radio>
		<Radio bind:group={api} value="tracks">Tracks</Radio>
	</div>
	<div class="my-4">
		{#if api === 'tracks'}
			<Label class="space-y-2">
				<span>Playlist ID</span>
				<Input type="text" placeholder="Playlist ID" bind:value={playlistId} />
			</Label>
			<Button class="my-4" on:click={() => getTracks()}>Get Tracks</Button>
		{/if}

		{#if api === 'playlists'}
			<Label class="space-y-2">
				<span>Playlist ID</span>
				<Input type="text" placeholder="Playlist ID" />
			</Label>
		{/if}
	</div>
	{#if response}
		<div class="my-4 font-mono whitespace-pre">
			{response}
		</div>
	{/if}
</div>
