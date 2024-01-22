<script>
	import { onMount } from "svelte";
	import { queue, currentTrack } from "$lib/stores.js";
	import SvgIcon from "$lib/components/SvgIcon.svelte";
	import Artists from "$lib/components/Artists.svelte";
	import * as YTM from '$lib/ytm.js';

	export let index = 0;

	let player = null;
	let isPlaying = false;
	let playerState = 0;
	let trackTime = '';
	let trackLength = '';
	let trackPosition = 0;
	let skipNextUpdate = false;
	let videoId = null;

	let queuePosition = "100vh";

	// Weird issue here. When calling playVideo(), the
	// player variable gets all messed up. So, start video
	// directly instead of calliing playVideo()
	$: if ($currentTrack && videoId !== $currentTrack.videoId) {
		videoId = $currentTrack.videoId;
		if (player) {
			player.loadVideoById(videoId);
		}

		// Need to find place in queue so that next and previous buttons work.
		for (let i = 0; i < $queue.length; i++) {
			if ($queue[i].videoId === videoId) {
				index = i;
				break;
			}
		}
	}

	function formatTime(seconds) {
		// Calculate hours, minutes, and seconds
		seconds = Math.floor(seconds);
		let hours = Math.floor(seconds / 3600);
		let minutes = Math.floor((seconds % 3600) / 60);
		let remainingSeconds = seconds % 60;

		// Create the formatted time string
		let timeString = '';
		if (hours > 0) {
			timeString += `${hours}:`;
		}

		if (minutes < 10 && hours > 0) {
			timeString += `0${minutes}:`
		} else {
			timeString += `${minutes}:`
		}

		if (remainingSeconds < 10) {
			timeString += `0${remainingSeconds}`;
		} else {
			timeString += `${remainingSeconds}`;
		}

		return timeString;
	}

	function setVideo(id) {
		for (let i = 0; i < $queue.length; i++) {
			if ($queue[i].videoId === id) {
				$currentTrack = $queue[i];
				break;
			}
		}
	}

	onMount(() => {
		player = new YT.Player('player', {
			width: "40%",
			// videoId: $currentTrack.videoId,
			playerVars: {
				playsinline: 1
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});
	});

	function playVideo() {
		isPlaying = true;

		if (!$currentTrack) {
			return;
		}

		videoId = $currentTrack.videoId;

		const element = document.getElementById(`track-${videoId}`);
		if (element) {
			element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
		}

		if (!player) {
			setTimeout(playVideo, 500);
		} else {
			player.loadVideoById($currentTrack.videoId);
		}
	}

	function onPlayerReady(event) {
		event.target.playVideo();
	}

	function onPlayerStateChange(e) {
		playerState = parseInt(e.data);
		if (playerState === 0) {
			next();
		}
	}

	function previous() {
		index--;
		if (index < 0) {
			index = $queue.length - 1;
		}
		$currentTrack = $queue[index];
		playVideo();
	}

	function next() {
		index++;
		if (index >= $queue.length) {
			index = 0;
		}
		$currentTrack = $queue[index];
		playVideo();
	}

	function play() {
		playVideo();
	}

	function pause() {
		isPlaying = false;
		player.pauseVideo();
	}

	function resume() {
		player.playVideo();
	}

	/**
	 * Get the current timestamp of track
	 */
	function getTimes() {
		// Prevent a flicker
		if (skipNextUpdate) {
			skipNextUpdate = false;
			return;
		}

		if (player && playerState === 1) {
			const duration = player.getDuration();
			const time = player.getCurrentTime();
			trackLength = formatTime(duration);
			trackTime = formatTime(time);
			trackPosition = time / duration * 1000;
		}
	}
	setInterval(getTimes, 1000);


	/**
	 * Handle event when changing the track position slider
	 */
	function onTrackerChange() {
		if (!isPlaying) {
			playVideo();
		} else {
			const ratio = trackPosition / 1000;
			const timestamp  = ratio * player.getDuration();
			player.seekTo(timestamp, true);
			skipNextUpdate = true;
		}
	}

	function toggleQueue() {
		queuePosition = queuePosition === "100vh" ? "48px" : "100vh";
	}

	async function songInfo() {
		const data = await YTM.getSong($currentTrack.videoId);
		console.log(data);
	}
</script>

<style>
	#queue {
		top: var(--position);
		transition: top 0.5s ease 0s;
		height: calc(100vh - 128px);
	}

	#queue .playing {
		background-color: rgba(255, 255, 255, .1);
	}

	#queue .track {
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	#queue #list {
		height: calc(100vh - 128px);
		max-height: calc(100vh - 128px);
		overflow-y: auto;
	}
</style>

<div
	class="fixed w-full bottom-0 h-17 min-h-17 border-t-gray-400 px-2 py-1 bg-slate-200 dark:bg-slate-800 z-10"
	style="border-top-width: 1px; border-top-style: solid"
>
	<div class="flex flex-row items-center">
		<div class="px-4 w-16 inline-block h-6">{trackTime}</div>
		<input type="range" class="accent-teal-600 flex-grow" min="0" max="1000" bind:value={trackPosition} on:change={onTrackerChange}>
		<div class="px-4 w-16 inline-block h-6">{trackLength}</div>
	</div>
	<div class="flex flex-row justify-between items-center">
		<div id="player-controls">
			<button id="play-prev" class="inline-block px-3" on:click={previous}>
				<SvgIcon><path d="m16 7-7 5 7 5zm-7 5V7H7v10h2z" /></SvgIcon>
			</button>
			{#if playerState < 1}
				<button id="play-button" class="inline-block px-3" on:click={play}>
					<SvgIcon><path d="M7 6v12l10-6z" /></SvgIcon>
				</button>
			{:else if playerState == 1}
				<button id="pause-button" class="inline-block px-3" on:click={pause}>
					<SvgIcon><path d="M8 7h3v10H8zm5 0h3v10h-3z" /></SvgIcon>
				</button>
			{:else}
				<button id="resume-button" class="inline-block px-3" on:click={resume}>
					<SvgIcon><path d="M7 6v12l10-6z" /></SvgIcon>
				</button>
			{/if}
			<button id="play-next" class="inline-block px-3" on:click={next}>
				<SvgIcon><path d="M7 7v10l7-5zm9 10V7h-2v10z" /></SvgIcon>
			</button>
		</div>
		{#if $queue[index]?.title}
			<div id="track-info">
				<div class="flex flex-row items-center gap-2">
					<img style="height:40px;width:40px" src={$queue[index].thumbnails[0].url} alt="Track Thumbnail" />
					<div>
						<div>
							{$queue[index].title}
						</div>
						<div><Artists artists={$queue[index].artists} /></div>
					</div>
				</div>
			</div>
		{/if}

		<div id="player-options" style="width: 144px">
			<button on:click={toggleQueue}>Toggle Queue</button>
			<button on:click={songInfo}>Song Info (Console)</button>
		</div>
	</div>
</div>
<div id="queue" class="fixed h-full w-full bg-black" style="--position: {queuePosition}">
	<div class="flex flex-row gap-4 h-full max-h-full">
		<div id="player" style="width: 50%" class="self-center"/>
		<div id="list" style="width: 50%" class="self-start px-2 scroller">
			{#each $queue as track}
				<div
					id="track-{track.videoId}"
					class="track p-2 flex flex-row gap-4 border-b-slate-200 dark:border-b-slate-800 items-center cursor-pointer"
					class:playing={videoId === track.videoId}
					on:click={() => setVideo(track.videoId)}
					on:keypress={() => {}}
				>
					<img style="width:60px; height:60px" src={track.thumbnails[0].url} alt="thumbnail" />
					<div class="flex flex-row justify-between w-full">
						<div>
							<div class="title strong">{track.title}</div>
							<div>
								<Artists artists={track.artists} />
							</div>
						</div>
						<div>
							{track.duration}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
