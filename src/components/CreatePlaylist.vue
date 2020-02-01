<template>
	<v-container></v-container>
</template>
	
<script>
export default {
	name: "create-playlist",
	data: function() {
		return {
			loading: true,
			audioFeatures: Object,
			initialPlaylist: Object
		};
	},
	// methods: {
	// 	getTrackIDs() {
	// 		this.$http
	// 			.get("http://localhost:3000/get-track-ids", {
	// 				params: this.$route.params.playlists
	// 			})
	// 			.then(response => {
	// 				this.trackIDs = _.chunk(response.data, 50);
	// 				this.createPlaylistFromIDs();
	// 				this.getAudioFeaturesFromIDs();
	// 			})
	// 			.catch(err => {
	// 				console.log(err);
	// 			});
	// 	},
	// 	createPlaylistFromIDs() {
	// 		this.$http
	// 			.get("http://localhost:3000/create-playlist", {
	// 				params: {
	// 					tracks: this.trackIDs,
	// 					user: this.$attrs.user.id
	// 				}
	// 			})
	// 			.then(response => {
	// 				console.log(response);
	// 			})
	// 			.catch(err => {
	// 				console.log(err);
	// 			});
	// 	},
	// 	getAudioFeaturesFromIDs() {
	// 		this.$http
	// 			.get("http://localhost:3000/get-audio-features", {
	// 				params: this.trackIDs
	// 			})
	// 			.then(response => {
	// 				console.log(response);
	// 			})
	// 			.catch(err => {
	// 				console.log(err);
	// 			});
	// 	}
	// },
	mounted: function() {
		this.$http
			.get("http://localhost:3000/initialize-create-page", {
				params: {
					playlists: null,
					userID: this.$attrs.user.id
				}
			})
			.then(response => {
				console.log(response);
			})
			.catch(err => {
				console.log(err);
			});
	}
};
</script>