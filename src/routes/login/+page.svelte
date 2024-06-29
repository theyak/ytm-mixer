<script>
	import { onMount } from 'svelte';
    import { getOAuthUrl } from "$lib/oauth";
	import { getTokenFromCode } from "$lib/oauth";

	let oauthCode = null;
	let clicked = false;

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
	<div class="flex flex-col items-center m-10">
		<div class="flex flex-col gap-8 max-w-[700px] items-center">
			<p>
				Click the link below to open a new tab and login to YouTube Music.
				Once you've logged in, come back to this page and click the 'Continue'
				button.
			</p>
			<p>
				<a on:click={() => clicked = true} href={oauthCode.url} target="_blank">{oauthCode.url}</a>
			</p>
			<p>
				Click the button below after logging in with YouTube Music.
			</p>

			{#if clicked}
				<button class="btn btn-blue" on:click={completeLogin}>Complete Login</button>
			{:else}
				<button class="btn btn-blue opacity-50 cursor-not-allowed">Complete Login</button>
			{/if}
		</div>
	</div>
{/if}
