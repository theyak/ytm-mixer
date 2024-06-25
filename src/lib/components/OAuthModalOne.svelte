<script>
	import { createEventDispatcher } from 'svelte';
	import { oAuthModalOne, oAuthModalTwo } from "$lib/stores";
	import { Button, Modal } from 'flowbite-svelte';
    import { getOAuthUrl } from "$lib/oauth";

	const dispatch = createEventDispatcher();

	export let open = false;

    async function openYoutubeLogin() {
		const code = await getOAuthUrl();
		window.open(code.url, '_blank').focus();
        $oAuthModalTwo = true;
        $oAuthModalOne = false;
		localStorage.setItem("oauth-code", JSON.stringify(code));
    }
</script>

<Modal title="YouTube Music Login" class="w-96" bind:open autoclose on:hide={() => dispatch("close")}>
	<p>
		Press the button below to open a new tab and login to YouTube Music.
        Once you've logged in, come back to this page and click the 'Continue'
		button.
	</p>

	<svelte:fragment slot="footer">
		<Button on:click={openYoutubeLogin}>Continue</Button>
	</svelte:fragment>
</Modal>
