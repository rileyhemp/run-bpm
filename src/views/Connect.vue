<template>
	<v-container class="fill-height d-flex text-center flex-column justify-center align-center px-10 home-page">
		<p class="subtitle-1 app-description">
			Create killer running playlists in seconds. Filter your music by tempo, energy level, danceability and more.
		</p>

		<v-dialog v-model="dialog" persistent max-width="290">
			<template v-slot:activator="{ on }">
				<v-btn color="blue-grey lighten-2" v-on="on" @click="e1 = 1" rounded class="px-6 mb-5">take a tour</v-btn>
			</template>
			<v-card
				><v-stepper v-model="e1">
					<v-stepper-header>
						<v-stepper-step :complete="e1 > 1" step="1">Name of step 1</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="e1 > 2" step="2">Name of step 2</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step step="3">Name of step 3</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<v-btn color="primary" @click="e1 = 2">
								Next
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-btn color="primary" @click="e1 = 3">
								Next
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="3">
							<v-btn color="primary" @click="dialog = false">Got it</v-btn>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card>
		</v-dialog>
		<spotify-login />
	</v-container>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "../components/SpotifyLogin.vue";

export default {
	name: "Connect",
	components: {
		"spotify-login": SpotifyLogin
	},
	data() {
		return {
			dialog: false,
			e1: 1
		};
	},
	mounted: function() {
		if (window.location.search.length > 0) {
			this.$http
				.get(`https://d2ob92q3jfbd5e.cloudfront.net/authorize?${window.location.search.split("?")[1]}`)
				.then(res => {
					const credentials = {
						accessToken: res.data.body["access_token"],
						refreshToken: res.data.body["refresh_token"],
						expiresAt: new Date().getTime() + 3000000
					};
					localStorage.RunBPM = JSON.stringify(credentials);
					this.$router.push("/");
				})
				.catch(err => console.log(err));
		}
	}
};
</script>

<style>
.home-page {
	background-image: url("../assets/runbpm-logo.png");
	background-size: contain;
	background-color: black;
	background-position-y: 30%;
	width: 100%;
	margin: auto;
	background-position-x: 52%;
}
.app-description {
	max-width: 500px;
	padding-top: 50%;
}
@media screen and (min-width: 768px) {
	.home-page {
		background-image: url("../assets/runbpm-logo-desktop.png");
		background-position-y: 40%;
		background-size: 800px;
		flex-wrap: nowrap !important;
	}
	.app-description {
		padding-top: 200px;
	}
}
</style>

<style>
.theme--dark.v-application {
	background: black !important;
}
</style>
