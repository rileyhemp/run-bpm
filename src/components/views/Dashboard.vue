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
			displaySaved: false,
			loading: false
		};
	},
	methods: {
		getUserData() {
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
		},
		getCurrentTrack() {
			console.log("hi");
			this.$emit("updateTrack");
			this.$http
				.get("http://localhost:3000/player?q=current")
				.then(response => {
					this.nowPlaying = response.data;
					this.isPlaying = response.data.is_playing;
					if (response.data.item.id) {
						this.getTrackDetails(response.data.item.id);
					}
					if (response.data.is_playing) {
						this.initTimer(
							response.data.progress_ms,
							response.data.item.duration_ms
						);
					}
				})
				.catch(err => console.log(err));
		},
		getTrackDetails(id) {
			this.$http
				.get(`http://localhost:3000/analyze-tracks?id=${id}`)
				.then(response => {
					this.nowPlaying.audio_features = response.data;
				});
		},
		/* eslint indent: 0 */
		updatePlayState(event) {
			const play = () => {
				console.log("play was called");
				this.$http
					.put("http://localhost:3000/player?action=play", {
						data: this.options
					})
					.then(() => console.log("paused"))
					.catch(() => console.log("pause broke somewhere"));
			};
			const pause = () => {
				console.log("pause was called");
				this.$http
					.put("http://localhost:3000/player?action=pause")
					.then(() => console.log("paused"))
					.catch(() => console.log("pause broke somewhere"));
			};
			const previous = () => {
				console.log("previous was called");
				this.$http
					.put("http://localhost:3000/player?action=previous", {
						data: this.options
					})
					.then(() => console.log("previous"))
					.catch(() => console.log("previous broke somewhere"));
			};
			const next = () => {
				console.log("next was called");
				this.$http
					.put("http://localhost:3000/player?action=next", {
						data: this.options
					})
					.then(() => console.log("next"))
					.catch(() => console.log("next broke somewhere"));
			};
			switch (event) {
				case "play":
					play();
					break;
				case "pause":
					pause();
					break;
				case "previous":
					previous();
					break;
				case "next":
					next();
					break;
				default:
					console.log("Play state missing");
			}
		}
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
