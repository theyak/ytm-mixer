<script>
	export let artists = [];
</script>

{#each artists as artist, i}
	{#if artist.name !== "&" && artist.name !== ","}
		{#if artist.id}
			<a class="hover:underline" target="_blank" href={`https://music.youtube.com/channel/${artist.id}`}>{artist.name}</a>
		{:else}
			{artist.name}
		{/if}

		{#if i < artists.length - 1}
			{" • "}
		{/if}
	{/if}
{/each}