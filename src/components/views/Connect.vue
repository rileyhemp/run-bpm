<template>
	<v-container class="fill-height d-flex text-center flex-column justify-center align-center px-10">
		<h1 class="display-2 font-weight-medium">Welcome</h1>
		<p class="subtitle-2 mt-4">Run BPM lets you create personalized playlists at any tempo</p>
		<spotify-login />
	</v-container>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "../single_purpose/SpotifyLogin.vue";

export default {
	name: "Connect",
	components: {
		"spotify-login": SpotifyLogin
	}
};
</script>

<style>
.welcome {
	font-size: 72px;
}
</style>
