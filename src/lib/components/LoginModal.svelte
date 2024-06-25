<script>
	import { createEventDispatcher } from 'svelte';
	import { Button, Modal, Input, Textarea } from 'flowbite-svelte';
	import { login, playlists, isLoggedIn } from "$lib/stores";
	import { oAuthModalOne, oAuthModalTwo } from "$lib/stores";
	import LoginRetryModal from "$lib/components/LoginRetryModal.svelte";
	import * as YTM from '$lib/ytm.js';
	import OauthModalOne from "$lib/components/OAuthModalOne.svelte";
	import OauthModalTwo from "$lib/components/OAuthModalTwo.svelte";

	let authUser;
	let cookie;
	let retry = false;

	const dispatch = createEventDispatcher();

	async function onLogin() {
		localStorage.setItem("x-ytm-cookie", cookie);
		localStorage.setItem("x-ytm-user", authUser);
		const result = await YTM.getPlaylists();

		if (Array.isArray(result)) {
			$isLoggedIn = true;
			$playlists = result;
			$login = false;
			authUser = "";
			cookie = "";
			dispatch('login');
		} else {
			$isLoggedIn = false;
			$playlists = null;
			retry = true;
		}
	}

	function onOauthLogin() {
		$oAuthModalOne = true;
		$oAuthModalTwo = false;
		$login = false;
	}
</script>

<style lang="postcss">
	.tag {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
		border-radius: 3px;
		display: inline-block;
		font-weight: 700;
		color: theme(colors.green.500);
	}
	a {
		color: theme(colors.blue.700);
	}
</style>

<LoginRetryModal open={retry} on:close={() => {retry = false; $login = true}} />
<OauthModalOne bind:open={$login} on:close={() => $oAuthModalOne = false} />
<OauthModalTwo open={$oAuthModalTwo} on:close={() => $oAuthModalTwo = false} />
