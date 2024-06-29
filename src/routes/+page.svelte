<script>
	import { playlists, isLoggedIn } from '$lib/stores';
</script>

<div class="overflow-y-auto scroller px-4">
	<div style="margin: 16px auto">
		{#if $playlists && $playlists.length > 0}
			<div class="flex flex-row flex-wrap gap-8 justify-center">
				{#each $playlists as list}
				<a href={list.playlistId} style="max-width: 192px">
					<div>
						<img style="width: 192px;height: 192px; object-fit: cover" alt="" src={list.thumbnails[0].url} />
					</div>
					<div class="mt-1 text-slate-800 dark:text-slate-200">{list.title}</div>
				</a>
				{/each}
			</div>
		{:else if $isLoggedIn}
			Loading playlists...
		{/if}
	</div>
</div>
