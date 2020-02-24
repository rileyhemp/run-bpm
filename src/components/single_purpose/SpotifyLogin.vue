<template>
	<v-btn color="success" rounded class="px-6">Connect with Spotify</v-btn>
	<!-- <v-btn width="80%" :color="success" @click="authorizeSpotify">Connect with Spotify</v-btn> -->
</template>

<script>
export default {
	methods: {
		authorizeSpotify: function() {
			this.$http.get("http://localhost:3000/get-auth-url").then(data => {
				console.log(data);
				window.location.href = data.data;
			});
			//   this.$router.push("redirect");
		}
	}
};
</script>
