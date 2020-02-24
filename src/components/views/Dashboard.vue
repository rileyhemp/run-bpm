<template>
	<div class="dashboard">
		<v-overlay :value="loading" :z-index="1000">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<bpm-header :pageTitle="this.$router.currentRoute.name" :user="this.userData" />
		<router-view
			:userPlaylists="this.userPlaylists"
			:savedPlaylists="this.savedPlaylists"
			:userDevices="this.userDevices"
			:user="this.userData"
			:loading="this.loading"
			:currentTrack="this.currentTrack"
			:disablePlayButton="this.disablePlayButton"
			v-bind="$attrs"
			@updatePlaylists="updatePlaylists"
			@updateUserInfo="getUserData"
			@updateTrack="getCurrentTrack"
			@updatePlayState="updatePlayState"
		/>
	</div>
</template>

<script>
import HeaderVue from "../containers/Header.vue";
import {
	getCurrentTrack,
	getTrackDetails,
	initTimer,
	updatePlayState
} from "@/helpers/PlayerControls";
export default {
	name: "Dashboard",
	components: {
		"bpm-header": HeaderVue
	},
	data: function() {
		return {
			userData: Object,
			userPlaylists: Object,
			savedPlaylists: Object,
			userDevices: Object,
			currentTrack: {
				id: null,
				isPlaying: false
			},
			disablePlayButton: false,
			displaySaved: false,
			loading: false
		};
	},
	methods: {
		getCurrentTrack,
		getTrackDetails,
		initTimer,
		updatePlayState,
		getUserData() {
			this.getCurrentTrack();
			this.loading = true;
			this.$http
				.get("http://localhost:3000/get-user-data")
				.then(response => {
					this.userData = response.data.userData;
					this.userPlaylists = response.data.userPlaylists;
					this.userDevices = response.data.userDevices;
					this.updatePlaylists();
					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		},
		updatePlaylists() {
			this.loading = true;
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
					this.savedPlaylists = parsedData;
					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
					console.log(err);
				});
		}
		// getCurrentTrack() {
		// 	this.disablePlayButton = false;
		// 	this.$http
		// 		.get("http://localhost:3000/player?q=current")
		// 		.then(response => {
		// 			this.currentTrack.id = response.data;
		// 			this.currentTrack.isPlaying = response.data.is_playing;
		// 			if (response.data.item.id) {
		// 				this.getTrackDetails(response.data.item.id);
		// 			}
		// 			if (response.data.is_playing) {
		// 				this.currentTrack.duration =
		// 					response.data.item.duration_ms;
		// 				this.initTimer(
		// 					response.data.progress_ms,
		// 					response.data.item.duration_ms
		// 				);
		// 			}
		// 		})
		// 		.catch(err => console.log(err));
		// },
		// getTrackDetails(id) {
		// 	this.$http
		// 		.get(`http://localhost:3000/analyze-tracks?id=${id}`)
		// 		.then(response => {
		// 			this.currentTrack.audioFeatures = response.data;
		// 		});
		// },
		// initTimer(progress, duration) {
		// 	//Catch element for use in interval
		// 	const self = this;
		// 	//Not perfect, but due to latency progress needs to start back one second to match Spotify.
		// 	progress = progress - 1000;
		// 	let i = setInterval(() => {
		// 		progress = progress + 1000;
		// 		self.currentTrack.progress = progress;
		// 		if (progress >= duration) {
		// 			clearInterval(i);
		// 			this.getCurrentTrack();
		// 		}
		// 	}, 1000);
		// },
		// /* eslint indent: 0 */
		// updatePlayState(event) {
		// 	this.disablePlayButton = true;
		// 	let options = {};
		// 	if (event.device) {
		// 		this.userData.activeDevice = event.device;
		// 		options.device_id = event.device;
		// 	} else {
		// 		options.device_id = this.userData.activeDevice;
		// 	}
		// 	if (event.content) {
		// 		options.context_uri = event.content;
		// 	}
		// 	const play = () => {
		// 		this.$http
		// 			.put("http://localhost:3000/player?action=play", {
		// 				data: {
		// 					...options
		// 				}
		// 			})
		// 			.then(() => this.getCurrentTrack())
		// 			.catch(error => console.log(error));
		// 	};
		// 	const pause = () => {
		// 		this.$http
		// 			.put("http://localhost:3000/player?action=pause")
		// 			.then(() => this.getCurrentTrack())
		// 			.catch(() => console.log("pause broke somewhere"));
		// 	};
		// 	const previous = () => {
		// 		console.log("previous was called");
		// 		this.$http
		// 			.put("http://localhost:3000/player?action=previous", {
		// 				data: this.options
		// 			})
		// 			.then(() => console.log("previous"))
		// 			.catch(() => console.log("previous broke somewhere"));
		// 	};
		// 	const next = () => {
		// 		console.log("next was called");
		// 		this.$http
		// 			.put("http://localhost:3000/player?action=next", {
		// 				data: this.options
		// 			})
		// 			.then(() => console.log("next"))
		// 			.catch(() => console.log("next broke somewhere"));
		// 	};
		// 	switch (event.state) {
		// 		case "play":
		// 			play();
		// 			break;
		// 		case "pause":
		// 			pause();
		// 			break;
		// 		case "previous":
		// 			previous();
		// 			break;
		// 		case "next":
		// 			next();
		// 			break;
		// 		default:
		// 			console.log("Play state missing");
		// 	}
		// }
	},
	//create user is authenticated function
	mounted: function() {
		if (window.localStorage.RunBPM !== undefined) {
			this.$http
				.get(
					`http://localhost:3000/validate-user?${window.localStorage.RunBPM}`
				)
				.then(() => {
					this.getUserData();
				})
				.catch(err => console.log(err));
		} else {
			this.$router.push("connect");
		}
	}
};
</script>
