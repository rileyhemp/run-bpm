<template>
	<v-container v-if="!this.redirect" class="fill-height d-flex text-center flex-column justify-center align-center px-10">
		<div class="hero-image" />
		<div class="home">
			<h1>Run BPM</h1>
			<p class="subtitle-1 app-description">
				Create killer running playlists in seconds. Filter your own music by tempo, energy level, danceability and more.
			</p>

			<spotify-login source="/" />
			<guest-login />
			<v-dialog v-model="dialog" :max-width="500">
				<template v-slot:activator="{ on }">
					<v-btn text v-on="on" width="230" @click="walkthrough = true" rounded class="px-6 mb-4">take a tour</v-btn>
				</template>
				<walkthrough v-if="dialog" />
			</v-dialog>
		</div>
	</v-container>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "../components/SpotifyLogin.vue";
import GuestLogin from "../components/GuestLogin.vue";
import Walkthrough from "../components/Walkthrough.vue";

export default {
	name: "Connect",
	components: {
		"spotify-login": SpotifyLogin,
		"guest-login": GuestLogin,
		walkthrough: Walkthrough,
	},
	data() {
		return {
			dialog: false,
			redirect: false,
			walkthrough: false,
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
h1 {
	color: rgb(247, 245, 236);
	font-size: 3.5rem;
	font-weight: 900;
	text-transform: uppercase;
	@media screen and (min-width: 500px) {
		font-size: 5rem;
	}
	@media screen and (min-width: 660px) {
		font-size: 6rem;
	}
	@media screen and (min-width: 900px) {
		font-size: 7rem;
	}
}
.app-description {
	max-width: 500px;
}
.home {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 2;
}
.hero-image {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-image: url("../assets/runbpm-logo-new.png");
	background-size: contain;
	background-position-y: 25%;
	transform: scale(1.2) translateX(5%);
	@media screen and (min-width: 768px) {
		background-position-y: 40%;
	}
}
</style>

<style>
.theme--dark.v-application {
	background: black !important;
}
</style>
