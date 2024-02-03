<script>
	import { createEventDispatcher } from 'svelte';
	import { oAuthModalOne, oAuthModalTwo } from "$lib/stores";
	import { Button, Modal } from 'flowbite-svelte';
    import { getTokenFromCode } from "$lib/oauth";

	const dispatch = createEventDispatcher();

	export let open = false;

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
    }
</script>

<Modal title="OAuth Login" class="w-96" bind:open autoclose on:hide={() => dispatch("close")}>
	<p>
        Press the button below AFTER you have logged in to YouTube Music.
    </p>

	<svelte:fragment slot="footer">
		<Button on:click={onContinue}>Continue</Button>
	</svelte:fragment>
</Modal>
