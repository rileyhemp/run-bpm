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
		console.log(this.$route.params.playlists);
	}
};
</script>