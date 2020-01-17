<template>
	<div class="dashboard">
		<h1>Dashboard</h1>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			spotifyApi: Object
		};
	}
	// mounted: function() {
	// 	this.$http
	// 		.get("http://localhost:3000/api", {
	// 			params: {
	// 				method: "getArtistAlbums",
	// 				query: "43ZHCT0cAZBISjO8DG9PnE",
	// 				options: { limit: 10, offset: 20 }
	// 			}
	// 		})
	// 		.then(function(data) {
	// 			console.log(data);
	// 		});
	// }
};
</script>
