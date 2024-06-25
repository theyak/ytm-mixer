<script>
	import { createEventDispatcher } from 'svelte';
	import { oAuthModalOne, oAuthModalTwo } from "$lib/stores";
	import { Button, Modal } from 'flowbite-svelte';
	import { getTokenFromCode } from "$lib/oauth";
	import { playlists, isLoggedIn } from "$lib/stores";
	import * as YTM from '$lib/ytm.js';

	const dispatch = createEventDispatcher();

	export let open = false;

	async function getPlaylists() {
		const token = localStorage.getItem("oauth-token");
		if (!token) {
			setTimeout(getPlaylists, 500);
			return;
		}

		const lists = await YTM.getPlaylists();
		if (Array.isArray(lists)) {
			$isLoggedIn = true;
			$playlists = lists;
			dispatch('login');
		} else {
			$isLoggedIn = false;
			$playlists = null;
		}
	}

	async function onContinue() {
		const code = localStorage.getItem("oauth-code");
		if (!code) {
			$oAuthModalOne = true;
			$oAuthModalTwo = false;
			return;
		}

		const data = JSON.parse(code);
		const result = await getTokenFromCode(data.device_code);
		localStorage.setItem("oauth-token", JSON.stringify(result));

		$oAuthModalTwo = false;

		getPlaylists();
	}
</script>

<Modal title="YouTube Music Login" class="w-96" bind:open autoclose on:hide={() => dispatch("close")}>
	<p>
		Press the button below AFTER you have logged in to YouTube Music.
	</p>

	<svelte:fragment slot="footer">
		<Button on:click={async() => await onContinue()}>Continue</Button>
	</svelte:fragment>
</Modal>
