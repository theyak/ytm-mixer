<script>
	import { oAuthModalOne, oAuthModalTwo } from "$lib/stores";
	import OauthModalOne from "$lib/components/OAuthModalOne.svelte";
	import OauthModalTwo from "$lib/components/OAuthModalTwo.svelte";
</script>

<OauthModalOne bind:open={$oAuthModalOne} on:close={() => $oAuthModalOne = false} />
<OauthModalTwo open={$oAuthModalTwo} on:close={() => $oAuthModalTwo = false} />
