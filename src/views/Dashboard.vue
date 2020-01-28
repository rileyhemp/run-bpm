<template>
	<div class="dashboard"></div>
</template>

<script>
export default {
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
