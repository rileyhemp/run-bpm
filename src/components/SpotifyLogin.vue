<template>
	<v-btn color="success" width="230" @click="authorizeSpotify" rounded class="px-6 mb-4">Connect with Spotify</v-btn>
</template>

<script>
export default {
	methods: {
		authorizeSpotify: function() {
			this.$http
				.get("http://localhost:3000/get-auth-url")
				.then((data) => {
					console.log(data);
					window.location.href = data.data;
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>
