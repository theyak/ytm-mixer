<script>
	import { createEventDispatcher } from 'svelte';
	import { login } from "$lib/stores";
	import { Button, Modal } from 'flowbite-svelte';

	const dispatch = createEventDispatcher();

	export let open = false;
</script>

<Modal title="Invalid Login" class="w-96"  bind:open autoclose on:hide={() => dispatch("close")}>
	<p>
		The login credentials you provided were incorrect. Please try again.
	</p>

	<svelte:fragment slot="footer">
		<Button on:click={() => $login = true}>OK</Button>
	</svelte:fragment>
</Modal>