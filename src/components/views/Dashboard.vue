<template>
	<div class="dashboard">
		<v-overlay :value="loading" :z-index="1000">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<bpm-header :pageTitle="this.$router.currentRoute.name" :user="this.userData" />
		<router-view
			:userPlaylists="this.userPlaylists"
			:CreatedPlaylists="this.CreatedPlaylists"
			:userDevices="this.userDevices"
			:user="this.userData"
			:loading="this.loading"
			:currentTrack="this.currentTrack"
			:disableButtons="this.disableButtons"
			v-bind="$attrs"
			@updatePlaylists="updatePlaylists"
			@updateUserInfo="getUserData"
			@updateTrack="getCurrentTrack"
			@updatePlayState="updatePlayState"
			@loading="loading = true"
		/>
	</div>
</template>

<script>
import HeaderVue from "../containers/Header.vue";
import { getCurrentTrack, getTrackDetails, initTimer, updatePlayState } from "@/helpers/PlayerMethods";
export default {
	name: "Dashboard",
	components: {
		"bpm-header": HeaderVue
	},
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object,
			CreatedPlaylists: Object,
			userDevices: Object,
			currentTrack: {
				id: null,
				isPlaying: false
			},
			disableButtons: false,
			displaySaved: false,
			loading: false
		};
	},
	methods: {
		getUserData() {
			let userCredientials = JSON.parse(localStorage.RunBPM);
			this.getCurrentTrack();
			this.loading = true;
			this.$http
				.get("http://localhost:3000/get-user-data", {
					params: {
						user: JSON.stringify(userCredientials)
					}
				})
				.then(response => {
					this.userData = response.data.userData;
					this.userPlaylists = response.data.userPlaylists;
					this.userDevices = response.data.userDevices;
					this.updatePlaylists();
					userCredientials.accessToken = response.data.userCredentials.token;
					userCredientials.expiresAt = response.data.userCredentials.expiresAt;
					localStorage.RunBPM = JSON.stringify(userCredientials);
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		},
		updatePlaylists() {
			this.$http
				.get(`http://localhost:3000/playlists?id=${this.userData.id}`)
				.then(response => {
					let parsedData = response.data.map(el => {
						return {
							id: el.playlist_id,
							tracks: JSON.parse(el.tracks),
							metadata: JSON.parse(el.metadata)
						};
					});
					this.CreatedPlaylists = parsedData;
					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		},
		getCurrentTrack,
		getTrackDetails,
		initTimer,
		updatePlayState
	},
	mounted: function() {
		if (Object.entries(this.userData).length === 0) {
			this.getUserData();
		}
	}
};
</script>
