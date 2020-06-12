<template>
	<v-container v-if="!this.redirect" class="fill-height d-flex text-center flex-column justify-center align-center px-10">
		<div class="home-page">
			<div class="content-home">
				<p class="subtitle-1 app-description">
					Create killer running playlists in seconds. Filter your music by tempo, energy level, danceability and more.
				</p>

				<spotify-login />
				<guest-login />
				<v-dialog v-model="dialog" max-width="500">
					<template v-slot:activator="{ on }">
						<v-btn text v-on="on" width="230" @click="e1 = 1" rounded class="px-6 mb-4">take a tour</v-btn>
					</template>
					<v-card
						><v-stepper v-model="e1" class="pb-8">
							<v-stepper-header>
								<v-stepper-step :complete="e1 > 1" step="1"></v-stepper-step>

								<v-divider></v-divider>

								<v-stepper-step :complete="e1 > 1" step="2"></v-stepper-step>

								<v-divider></v-divider>

								<v-stepper-step :complete="e1 > 2" step="3"></v-stepper-step>

								<v-divider></v-divider>

								<v-stepper-step :complete="e1 > 3" step="4"></v-stepper-step>
							</v-stepper-header>

							<v-stepper-items>
								<v-stepper-content step="1">
									<h2>Welcome to Run BPM</h2>
									<p class="caption">
										Run BPM is the most advanced playlist creation tool for runners. Filter your own Spotify library by tempo and
										match your music to your pace.
									</p>
									<h4>Did you know:</h4>
									<p class="caption">
										Studies show runners perform better when the beats-per-minute (BPM) of their music matches their cadence?
									</p>
									<v-btn color="primary" @click="e1 = 2" bottom>
										Next
									</v-btn>
								</v-stepper-content>

								<v-stepper-content step="2">
									<h2>Step 1:</h2>
									<p class="caption">
										Import one or more Spotify playlists. These can be yours or any public playlist.
									</p>
									<v-img
										src="../assets/demo/import.gif"
										position="center top"
										aspect-ratio="1"
										class="mb-4"
										max-height="300"
										max-width="300"
									/>
									<v-btn color="primary" @click="e1 = 3">
										Next
									</v-btn>
								</v-stepper-content>

								<v-stepper-content step="3">
									<h2>Step 2:</h2>
									<p class="caption">
										Use the sliders to dial in your selection. You can filter by beats-per-minute, energy level, danceability and
										more.
									</p>
									<v-img
										src="../assets/demo/filter2.gif"
										position="center top"
										aspect-ratio="1"
										class="mb-4"
										max-height="300"
										max-width="300"
									/>
									<v-btn color="primary" @click="e1 = 4">
										Next
									</v-btn>
								</v-stepper-content>

								<v-stepper-content step="4">
									<h2>Let's go!</h2>
									<p class="caption">
										Run BPM is 100% free and we will never sell your data. Click below to get started.
									</p>
									<div class="d-flex justify-center">
										<spotify-login source="/" />
									</div>
								</v-stepper-content>
							</v-stepper-items>
						</v-stepper>
					</v-card>
				</v-dialog>
			</div>
		</div>
	</v-container>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "../components/SpotifyLogin.vue";
import GuestLogin from "../components/GuestLogin.vue";

export default {
	name: "Connect",
	components: {
		"spotify-login": SpotifyLogin,
		"guest-login": GuestLogin,
	},
	data() {
		return {
			dialog: false,
			e1: 1,
			redirect: false,
		};
	},
	mounted: function() {
		console.log(this.$root);
		if (window.location.search.length > 0) {
			//If redirect is true, the template doesn't render
			this.redirect = true;
			//Get access token and navigat to page designated as the login source on document.cookie
			this.$http
				.get(`http://localhost:3000/authorize?${window.location.search.split("?")[1]}`)
				.then((res) => {
					const credentials = {
						accessToken: res.data.body["access_token"],
						refreshToken: res.data.body["refresh_token"],
						expiresAt: new Date().getTime() + 3000000,
						isGuest: false,
					};
					localStorage.RunBPM = JSON.stringify(credentials);
					this.redirect = false;
					//Storing source of login in cookie
					this.$router.push(document.cookie || "/");
				})
				.catch((err) => console.log(err));
		}
	},
};
</script>

<style lang="scss">
.home-page {
	background-image: url("../assets/runbpm-logo.png");
	background-size: contain;
	background-color: black;
	width: 100%;
	margin: auto;
	background-position-x: 52%;
	height: 90vh;
	max-height: 650px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	background-position-y: 10%;
	@media screen and (min-width: 768px) {
		background-position-y: 30%;
	}
}
.app-description {
	max-width: 500px;
	/* padding-top: 50%; */
}
.content-home {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 25%;
}
@media screen and (min-width: 500px) {
	.content-home {
		bottom: 18%;
	}
}
@media screen and (min-width: 768px) {
	.home-page {
		background-image: url("../assets/runbpm-logo-desktop.png");
		background-position-y: 40%;
		background-size: 800px;
		flex-wrap: nowrap !important;
	}
	.content-home {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 10%;
	}
}
</style>

<style>
.theme--dark.v-application {
	background: black !important;
}
</style>
