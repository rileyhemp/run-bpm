<template>
	<v-btn color="blue-grey lighten-1" width="230" @click="authorizeSpotify" rounded class="px-6 mb-4">Continue as Guest</v-btn>
</template>

<script>
export default {
	methods: {
		authorizeSpotify: function() {
			this.$http
				.get("http://localhost:3000/get-guest-credentials")
				.then((res) => {
					const credentials = {
						accessToken: res.data["access_token"],
						refreshToken: null,
						isGuest: true,
						expiresAt: new Date().getTime() + 3000000,
					};
					localStorage.RunBPM = JSON.stringify(credentials);
					this.$router.push("/import");
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>
