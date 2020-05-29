<template>
	<v-btn color="success" @click="authorizeSpotify" rounded class="px-6">Connect with Spotify</v-btn>
</template>

<script>
export default {
	methods: {
		authorizeSpotify: function() {
			this.$http
				.get("https://d2ob92q3jfbd5e.cloudfront.net/get-auth-url")
				.then((data) => {
					console.log(data);
					window.location.href = data.data;
				})
				.catch((err) => console.log(err));
			//   this.$router.push("redirect");
		},
	},
};
</script>
