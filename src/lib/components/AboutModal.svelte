<script>
	import { Button, Modal, Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let open;
</script>

<Modal title="About" bind:open={open} autoclose class="w-96" on:hide={() => dispatch("close")}>
	<p>
		I wanted a project to try out SvelteKit and Tailwind CSS, and I also
		wanted to be able to randomly shuffle and save a playlist to YouTube Music,
		so, I made this!
	</p>
	<p>
		<strong>Usage:</strong> Click playlist, click shuffle button, click save button.
		You can also click playlist headers to sort.
	</p>
	<p>
		<strong>Data Collection Policy:</strong> We do not collect
		any data. All storage is done via the browser's localStoage.
	</p>
	<p>
		<strong>Disclaimer:</strong> I make absolutely no guarantees of how well this
		will work for you. Use at your own risk.
	</p>

	<svelte:fragment slot="footer">
		<Button>OK</Button>
	</svelte:fragment>
</Modal>