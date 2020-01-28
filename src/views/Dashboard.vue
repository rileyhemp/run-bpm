<template>
	<div class="dashboard">
		<bpm-header pageTitle="Dashbaord" :user="this.userData" />
	</div>
</template>

<script>
import Header from "../components/Header";
export default {
	name: "Dashboard",
	components: {
		"bpm-header": Header
	},
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object,
			playlistThumbs: Array
		};
	},
	mounted: async function() {
		this.userData = await this.callSpotifyApi("getMe");
		this.userPlaylists = await this.callSpotifyApi(
			"getUserPlaylists",
			this.userData.id
		);
	}
};
</script>
