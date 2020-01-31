<template>
	<div class="dashboard">
		<bpm-header :pageTitle="this.$router.currentRoute.name" :user="this.userData" />
		<router-view :playlists="this.userPlaylists" />
	</div>
</template>

<script>
import HeaderVue from "../components/Header.vue";
export default {
	name: "Dashboard",
	components: {
		"bpm-header": HeaderVue
	},
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object
		};
	},
	methods: {
		getPlaylists(data) {
			console.log("abc", data);
		}
	},
	mounted: async function() {
		this.userData = await this.callSpotifyApi("getMe");
		this.userPlaylists = await this.callSpotifyApi(
			"getUserPlaylists",
			this.userData.id,
			{ limit: 50, offset: 0 }
		);
	}
};
</script>
