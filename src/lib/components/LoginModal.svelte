<script>
	import { createEventDispatcher } from 'svelte';
	import { Button, Modal, Input, Textarea } from 'flowbite-svelte';
	import { login, playlists, isLoggedIn } from "$lib/stores";
	import LoginRetryModal from "$lib/components/LoginRetryModal.svelte";
	import * as YTM from '$lib/ytm.js';

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

<LoginRetryModal open={retry} on:close={() => {retry = false; $login = true}}/>

<Modal title="Login" autoclose bind:open={$login} on:hide={() => dispatch("close")}>
	<p>
		Sorry, this is super annoying, but it's the only way we could get this to work
		without bumping into Google's usage limits.
		<strong>We do not store authentication information</strong>. All login credentials are stored only in your
		browser's localStoage. For extra safety, consider downloading and running this
		application locally.
	</p>

	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Open  <a target="_blank" href="https://music.youtube.com" rel="noreferrer">https://music.youtube.com</a> in another tab.
		If you are not already logged in to YouTube Music, log in with a Google account.
	</p>

	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Open developer tools and go to the <span class="tag">Network</span> tab.
		Look for a URL that starts with <span class="tag">browse</span>.
		Click the <span class="tag">Headers</span> subtab and under
		Request Headers copy/paste the value for <span class="tag">Cookie:</span>
		below. See
		<a href="https://mkyong.com/computer-tips/how-to-view-http-headers-in-google-chrome/">here</a>
		for more information.
	</p>

	<Textarea placeholder="Cookie value from YouTube Music" rows="6" bind:value={cookie}/>

	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Continuing to look at the Request Headers, look for the value associated
		with <span class="tag">x-google-authuser</span>. Enter that value below.
	</p>

	<Input let:props>
		<div slot="left">#</div>
		<input type="number" {...props} bind:value={authUser} placeholder="x-goog-authuser" />
	</Input>

	<svelte:fragment slot="footer">
		<Button on:click={() => onLogin()}>Login</Button>
		<Button color="alternative" on:click={() => $login = false}>Nevermind</Button>
	</svelte:fragment>
</Modal>