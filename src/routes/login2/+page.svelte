<script>
	import { onMount } from 'svelte';
    import { getOAuthUrl } from "$lib/oauth";
	import { getTokenFromCode } from "$lib/oauth";

	let oauthCode = null;

	onMount(async () => {
		oauthCode = await getOAuthUrl();
	});

	async function completeLogin() {
		const result = await getTokenFromCode(oauthCode.device_code);
		localStorage.setItem("oauth-token", JSON.stringify(result));
		window.location.href = "/";
	}

</script>

{#if oauthCode}
	<a href={oauthCode.url} target="_blank">{oauthCode.url}</a>
	<br><br>
	<button on:click={completeLogin}>Then click here</button>
{/if}