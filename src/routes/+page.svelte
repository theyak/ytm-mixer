<script>
	import { onMount } from 'svelte';
	import { login, playlists, isLoggedIn } from '$lib/stores';
	import * as YTM from '$lib/ytm.js';
	import LoginModal from "$lib/components/LoginModal.svelte";

	onMount(async () => {
		if (!YTM.hasYoutubeMusicCookie()) {
			$login = true;
			$isLoggedIn = false;
			$playlists = [];
			return;
		}
	});
</script>

<LoginModal />

<div class="overflow-y-auto scroller px-4">
	<div style="margin: 16px auto">
		{#if $playlists && $playlists.length > 0}
			<div class="flex flex-row flex-wrap gap-8 justify-center">
				{#each $playlists as list}
				<a href={list.playlistId} style="max-width: 192px">
					<div>
						<img style="width: 192px;height: 192px; object-fit: cover" alt="" src={list.thumbnails[0].url} />
					</div>
					<b>
						{list.title}
					</b>
				</a>
				{/each}
			</div>
		{:else if $isLoggedIn}
			Loading playlists...
		{/if}
	</div>
</div>
