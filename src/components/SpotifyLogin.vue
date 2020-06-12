<template>
	<v-btn color="success" width="230" @click="authorizeSpotify" rounded class="px-6 mb-4">Connect with Spotify</v-btn>
</template>

<script>
export default {
	props: ["source"],
	methods: {
		authorizeSpotify: function() {
			if (localStorage.RunBPM != undefined) {
				let sessionData = JSON.parse(localStorage.RunBPM);
				sessionData.isGuest = false;
				localStorage.RunBPM = JSON.stringify(sessionData);
				localStorage.removeItem("RunBPM");
			}
			document.cookie = this.source;
			this.$http
				.get("http://https://d2ob92q3jfbd5e.cloudfront.net/get-auth-url")
				.then((data) => {
					window.location.href = data.data;
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>
