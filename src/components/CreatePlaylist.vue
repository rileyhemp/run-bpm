<template>
	<v-container></v-container>
</template>
	
<script>
export default {
	name: "create-playlist",
	data: function() {
		return {
			loading: true
		};
	},
	mounted: function() {
		this.$http
			.get("http://localhost:3000/get-audio-features", {
				params: {
					playlists: this.$route.params.playlists
				}
			})
			.then(function(data) {
				console.log(data);
			});
	}
};
</script>