<script>
	import { Drawer, CloseButton } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { hideDrawer, playlists, login, queue, progress, isLoggedIn } from '$lib/stores';
	import { onMount } from 'svelte';
	import SvgIcon from "./components/SvgIcon.svelte";
	import * as YTM from '$lib/ytm.js';

	onMount(async () => {
		$playlists = await YTM.getPlaylists();
		if ($playlists.error) {
			$playlists = [];
			$login = true;
			$isLoggedIn = false;
		} else {
			$isLoggedIn = true;
			$login = false;
		}
	});

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	function prepLogin() {
		localStorage.removeItem("x-ytm-cookie");
		localStorage.removeItem("x-ytm-user");
		$playlists = [];
		$queue = [];
		$hideDrawer = true;
		$progress = -1;
		$isLoggedIn = false;
		$login = true;
	}

	async function ytmClientInfo() {
		const info = await YTM.getYtmClientInfo();
		console.log(info);
	}
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={$hideDrawer} id="sidebar1">
	<div class="flex items-center">
		<CloseButton on:click={() => ($hideDrawer = true)} class="mb-4 dark:text-gray-100" />
	</div>

	<div class="h-10 flex">
		<SvgIcon>
			<path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
		</SvgIcon>
		<button on:click={() => prepLogin()} class="ml-2 h-6 leading-6">{$isLoggedIn ? "Logout" : "Login"}</button>
	</div>

	<div class="h-10 flex">
		<SvgIcon>
			<path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
			<path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path>
		</SvgIcon>
		<button on:click={() => ytmClientInfo()} class="ml-2 h-6 leading-6">YTMClient Info (to console)</button>
	</div>

	{#if $playlists && $playlists.length > 0}
		<div class="h-10 flex">
		<SvgIcon>
			<path d="M13 16.493C13 18.427 14.573 20 16.507 20s3.507-1.573 3.507-3.507c0-.177-.027-.347-.053-.517H20V6h2V4h-3a1 1 0 0 0-1 1v8.333a3.465 3.465 0 0 0-1.493-.346A3.51 3.51 0 0 0 13 16.493zM2 5h14v2H2z"></path>
			<path d="M2 9h14v2H2zm0 4h9v2H2zm0 4h9v2H2z"></path>
		</SvgIcon>
		<span class="ml-2 h-6 leading-6">Playlists</span>
		</div>
		{#each $playlists as list}
			<div class="h-8 flex ml-8">
				<a href={`/${list.playlistId}`}>{list.title}</a>
			</div>
		{/each}
	{/if}
</Drawer>
