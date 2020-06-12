<template>
	<v-card
		><v-stepper v-model="slide" class="pb-8">
			<v-stepper-header>
				<v-stepper-step :complete="slide > 1" step="1"></v-stepper-step>

				<v-divider></v-divider>

				<v-stepper-step :complete="slide > 1" step="2"></v-stepper-step>

				<v-divider></v-divider>

				<v-stepper-step :complete="slide > 2" step="3"></v-stepper-step>

				<v-divider></v-divider>

				<v-stepper-step :complete="slide > 3" step="4"></v-stepper-step>
			</v-stepper-header>

			<v-stepper-items>
				<v-stepper-content step="1">
					<h2>Welcome to Run BPM</h2>
					<p class="caption">
						Run BPM is the most advanced playlist creation tool for runners. Filter your own Spotify library by tempo and match your music
						to your pace.
					</p>
					<h4>Did you know:</h4>
					<p class="caption">
						Studies show runners perform better when the beats-per-minute (BPM) of their music matches their cadence?
					</p>
					<v-btn color="primary" @click="slide = 2" bottom>
						Next
					</v-btn>
				</v-stepper-content>

				<v-stepper-content step="2">
					<h2>Step 1:</h2>
					<p class="caption">
						Import one or more Spotify playlists. These can be yours or any public playlist.
					</p>
					<v-img src="../assets/demo/import.gif" position="center top" aspect-ratio="1" class="mb-4" max-height="300" max-width="300" />
					<v-btn color="primary" @click="slide = 3">
						Next
					</v-btn>
				</v-stepper-content>

				<v-stepper-content step="3">
					<h2>Step 2:</h2>
					<p class="caption">
						Use the sliders to dial in your selection. You can filter by beats-per-minute, energy level, danceability and more.
					</p>
					<v-img src="../assets/demo/filter2.gif" position="center top" aspect-ratio="1" class="mb-4" max-height="300" max-width="300" />
					<v-btn color="primary" @click="slide = 4">
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
</template>

<script>
import SpotifyLogin from "../components/SpotifyLogin.vue";

export default {
	components: {
		"spotify-login": SpotifyLogin,
	},
	data() {
		return {
			slide: 1,
		};
	},
};
</script>
