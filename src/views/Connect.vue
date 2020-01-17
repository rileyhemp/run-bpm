<template>
	<div class="connect">
		<spotify-login />
	</div>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "@/components/SpotifyLogin.vue";

export default {
	name: "Connect",
	components: {
		"spotify-login": SpotifyLogin
	}
};
</script>
