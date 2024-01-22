<script>
	import { Button, Modal, Input } from 'flowbite-svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let open;
	export let onSave = (name) => {
		dispatch("save", {name});
		playlistName = "";
	};
	export let onCancel = () => {
		playlistName = "";
	};

	let playlistName;
	let inputRef;

	function focus() {
		if (!inputRef) {
			setTimeout(focus);
		} else {
			inputRef.focus();
		}
	}
</script>

<Modal
	title="Playlist Name"
	bind:open
	autoclose
	class="w-96"
	on:open={focus}
	on:hide={() => dispatch('close')}
>
	<p>Enter a name for your new playlist:</p>

	<Input let:props>
		<input bind:this={inputRef} {...props} bind:value={playlistName} placeholder="Playlist Name" />
	</Input>

	<svelte:fragment slot="footer">
		<Button on:click={() => onSave(playlistName)}>Create Playlist</Button>
		<Button on:click={() => onCancel()} color="alternative">Nevermind</Button>
	</svelte:fragment>
</Modal>
