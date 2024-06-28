<script>
	import { onMount } from 'svelte';
    import { getOAuthUrl } from "$lib/oauth";
	import { getTokenFromCode } from "$lib/oauth";

	let oauthCode = null;

	onMount(async () => {
		const code = localStorage.getItem("oauth-code");
		if (code) {
			const data = JSON.parse(code);
			const result = await getTokenFromCode(data.device_code);
			if (!result.error) {
				console.log("result", result);
				localStorage.setItem("oauth-token", JSON.stringify(result));
				window.location = "/";
			} else {
				oauthCode = await getOAuthUrl();
				localStorage.setItem("oauth-code", JSON.stringify(oauthCode));
				window.location = oauthCode.url;
			}
		} else {
			oauthCode = await getOAuthUrl();
			localStorage.setItem("oauth-code", JSON.stringify(oauthCode));
			window.location = oauthCode.url;
		}
	});
</script>
