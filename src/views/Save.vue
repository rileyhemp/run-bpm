// eslint-disable-file
<template>
	<v-container fluid>
		<v-row>
			<v-btn text class="ml-4" @click="() => this.$router.push('Create')">Back</v-btn>
		</v-row>
		<v-row class="mt-6 px-4">
			<p class="subtitle-1">Step 3 / 3</p>
			<v-spacer />
			<p class="subtitle-1">Review and save</p>
		</v-row>
		<v-row class="px-4 ">
			<span class="subtitle-1">What would you like to do?</span>
			<v-btn
				class="my-2"
				:color="createNewPlaylist ? 'primary' : 'default'"
				@click="
					createNewPlaylist = true;
					addToPlaylist = false;
				"
				block
				>Create a new playlist</v-btn
			>
			<v-btn
				class="my-2"
				:color="addToPlaylist ? 'primary' : 'default'"
				@click="
					addToPlaylist = true;
					createNewPlaylist = false;
				"
				block
				>Add to an existing playlist</v-btn
			>
		</v-row>
		<v-row v-if="createNewPlaylist" class="px-4 pb-8 pt-4">
			<v-text-field autofocus label="Enter a name" hide-details="auto" v-model="playlistName" />
		</v-row>
		<v-row class="px-4" v-if="createNewPlaylist"
			><v-btn
				color="primary"
				class="mr-2"
				@click="
					() => {
						this.createPlaylistFromSelection().then(() => this.$router.push('/'));
					}
				"
				block
				>Create</v-btn
			>
		</v-row>

		<v-row>
			<v-dialog v-model="confirm" width="300">
				<v-card v-if="!loading" class="pb-8">
					<v-card-actions>
						<v-spacer />
						<v-btn icon @click="closeModal"><v-icon>mdi-close</v-icon></v-btn>
					</v-card-actions>
					<v-card-title class="subtitle-1 no-word-break">
						What would you like to do?
					</v-card-title>
					<v-row class="mx-6 pb-8">
						<b-btn text class="py-2" @click="createNewPlaylist = true">Create a new playlist</b-btn>
						<b-btn text class="py-2" @click="addToPlaylist = true">Add selection to existing playlist</b-btn>
					</v-row>
				</v-card>
				<v-card v-if="addToPlaylist" class="pb-8">
					<v-card-actions>
						<v-spacer />
						<v-btn icon @click="closeModal"><v-icon>mdi-close</v-icon></v-btn>
					</v-card-actions>
					<v-card-title class="subtitle-1 no-word-break">
						Add to existing playlist
					</v-card-title>
					<v-btn v-for="playlist in this.$attrs.userPlaylists.items" :key="playlist.id">{{ playlist.name }}</v-btn>
					<!-- <p>{{ this.$attrs.userPlaylists.items[0].name }}</p> -->
					<user-playlist v-for="playlist in this.$attrs.userPlaylists.items" :key="playlist.id">{{ playlist.name }}</user-playlist>
				</v-card>
				<v-card v-if="createNewPlaylist" class="pb-8">
					<v-card-actions>
						<v-spacer />
						<v-btn icon @click="closeModal"><v-icon>mdi-close</v-icon></v-btn>
					</v-card-actions>
					<v-card-title class="subtitle-1 no-word-break">
						Create playlist
					</v-card-title>
					<v-row class="mx-4 pb-8">
						<v-text-field v-if="confirm" autofocus label="Enter a name" hide-details="auto" v-model="playlistName" />
					</v-row>
				</v-card>
				<v-card v-if="!loading && playlistName">
					<v-card-actions>
						<v-spacer />
						<v-btn icon @click="closeModal"><v-icon>mdi-close</v-icon></v-btn>
					</v-card-actions>
					<v-card-title class="subtitle-1 no-word-break">
						Your playlist {{ playlistName }} will be added to your Spotify library.
					</v-card-title>
					<v-card-text>Are you finished with this selection?</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							text
							@click="
								() => {
									this.saveAndReset();
								}
							"
							class="plain-btn"
							>Add another</v-btn
						>
						<v-btn
							color="green darken-1"
							text
							@click="
								() => {
									this.createPlaylistFromSelection().then(() => this.$router.push('/'));
								}
							"
							>Done</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
	</v-container>
</template>

<script>
import features from "@/assets/temp-features";
import "vue-slider-component/theme/default.css";
// import _ from "lodash";
import getIDsFromDetails from "@/scripts/getIDsFromDetails";
import Playlist from "../containers/Playlist";

export default {
	name: "save-playlist",
	components: {
		"user-playlist": Playlist
	},
	data: function() {
		return {
			loading: false,
			bars: true,
			audioFeatures: features,
			chartData: Object,
			chartsReady: false,
			renderKey: 1,
			playlistName: undefined,
			createNewPlaylist: true,
			addToPlaylist: false,
			finishedWithSelection: false,
			showMoreFilters: false,
			confirm: false,
			mountFilters: false,
			reviewCategory: null,
			playlistTracks: Object,
			playlistMetadata: Object
		};
	},
	methods: {
		closeModal() {
			this.confirm = false;
			this.createNewPlaylist = false;
		},
		createPlaylistFromSelection() {
			return new Promise((resolve, reject) => {
				//Add playlist name to metadata
				this.playlistMetadata.name = this.playlistName;
				const metadata = JSON.stringify(this.playlistMetadata);
				//Get array of selected track's IDs.
				const trackIDs = getIDsFromDetails(this.playlistTracks);
				this.$emit("loading");
				// Create the playlist
				this.$http
					.post("http://192.168.1.215:3000/playlists", {
						data: {
							userID: this.$attrs.user.id,
							trackIDs: trackIDs,
							metadata: metadata,
							name: this.playlistName,
							credentials: localStorage.RunBPM
						}
					})
					.then(() => {
						this.updateUserInfo();
						//Check to see if user info has updated before resolving promise
						let i = setInterval(() => {
							if (!this.$attrs.loading) {
								clearInterval(i);
								resolve();
							}
						}, 20);
					})
					.catch(err => {
						console.log("Something went wrong", err);
						this.loading = false;
						reject();
					});
			});
		},
		updateUserInfo() {
			this.$emit("updateUserInfo");
		},
		saveAndReset() {
			//Reset the selection, slider range, and chart
			this.createPlaylistFromSelection().then(() => {
				this.playlistName = undefined;
				Object.keys(this.filters).forEach(i => {
					this.filters[i].range = this.filters[i].defaultRange;
				});
				setTimeout(() => this.filterChartData(), 150);
			});
		},
		convertToDoubletime() {
			//Double tempo for tracks under 100bpm (90bpm ~= 180bpm)
			this.audioFeatures.forEach(track => {
				track.features.tempo = Math.round(track.features.tempo);
				track.features.tempo < 100
					? (track.features.doubletime = track.features.tempo * 2)
					: (track.features.doubletime = track.features.tempo);
			});
			this.mountFilters = true;
		},
		initChartData() {
			const filters = Object.keys(this.filters);
			//Loop through each filter
			filters.forEach(el => {
				const filter = this.filters[el];
				let multiplier;
				if (el === "doubletime") {
					multiplier = 1;
				} else {
					multiplier = 100;
				}
				const segments = [];
				//Group tracks into segments
				for (let i = filter.defaultRange[0]; i < filter.defaultRange[1]; i = i + filter.segmentSize) {
					let segment = {};
					let tracks = 0;
					//Count how many tracks are in each segment
					this.selectedTracks.forEach(track => {
						track.features[el] * multiplier >= i && track.features[el] * multiplier < i + filter.segmentSize ? tracks++ : null;
					});
					//Axis name
					segment.axis = i + 1;
					//Percentage of total tracks in segment
					segment.value = tracks / this.selectedTracks.length;
					if ((segment.axis = 1 & (segment.value > 0.2))) {
						segment.value = 0.2;
					}
					segment.valueSave = tracks / this.selectedTracks.length;
					//Number of tracks in segment
					segment.tracks = tracks;
					segments.push(segment);
				}
				this.chartData = { ...this.chartData, ...{ [el]: segments } };
				this.chartsReady = true;
				this.renderKey++;
			});
		},
		updateFilters: function(options) {
			this.$set(this.filters[options.filter], "range", options.range);
		},
		// prettier-ignore
		handleChartClick() {
			console.log(event.toElement.style.fill);
			document.querySelector(".review-circle").style.backgroundColor = event.toElement.style.fill;
			event.toElement.style.fill === "rgb(214, 39, 40)"
				? (this.reviewCategory = `BPM: ${this.lowBPM} - ${this.highBPM}`)
				: event.toElement.style.fill === "rgb(44, 160, 44)"
					? (this.reviewCategory = `Energy: ${this.filters.energy.range[0]} - ${this.filters.energy.range[1]}`)
					: event.toElement.style.fill === "rgb(255, 127, 14)"
						? (this.reviewCategory = `Danceability: ${this.filters.danceability.range[0]} - ${this.filters.danceability.range[1]}`)
						: event.toElement.style.fill === "rgb(31, 119, 180)"
							? (this.reviewCategory = `Valence: ${this.filters.valence.range[0]} - ${this.filters.valence.range[1]}`)
							: null;
		}
	},
	mounted: function() {
		this.playlistMetadata = JSON.parse(localStorage.playlistMetadata);
		this.playlistTracks = JSON.parse(localStorage.playlistTracks);
	}
};
</script>

<style scoped></style>
