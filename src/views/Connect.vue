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
						<v-stepper-step :complete="e1 > 1" step="1">Welcome</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="e1 > 1" step="2">Why use Run BPM?</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="e1 > 2" step="3">Importing music</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="e1 > 3" step="4">Creating playlists</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step :complete="e1 > 4" step="5">Done</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<h2>Welcome to Run BPM</h2>
							<p class="caption">Run BPM helps runners improve or maintain their cadence with music.</p>
							<h4>What is a running cadence?</h4>
							<p class="caption">
								Cadence refers to the number of steps you take per minute, and increasing it is one of the fastest ways to become a
								better runner.
							</p>
							<v-btn color="primary" @click="e1 = 2" bottom>
								Next
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="2">
							<h2>How does it work?</h2>
							<p class="caption">
								Run BPM lets you import your existing playlists, and create new ones at any tempo, or beats-per-minute.
							</p>
							<h4>Why is this important?</h4>
							<p class="caption">
								Not only is running to the beat more fun, but it can be a great tool to train your body and brain to adapt to a
								quicker cadence.
							</p>
							<v-btn color="primary" @click="e1 = 3">
								Next
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="3">
							<h2>Importing music</h2>
							<p class="body-1">
								Select one or more of your Spotify playlists to import.
							</p>
							<v-btn color="primary" @click="e1 = 4">
								Next
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="4">
							<v-btn color="primary" @click="e1 = 5">
								Next
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="5">
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
