// eslint-disable-file
<template>
	<v-container fluid>
		<v-row class="pr-4">
			<v-btn text class="ml-4" @click="() => this.$router.push('Import')">Back</v-btn>
			<v-spacer />
			<v-btn color="primary" class="mr-2" :disabled="loading" @click="savePlaylist">Create</v-btn>
		</v-row>
		<v-row class="mt-6 mx-4">
			<p class="subtitle-1">Step 2 / 3</p>
			<v-spacer />
			<p class="subtitle-1">Filter tracks</p>
		</v-row>
		<v-row class="px-3">
			<span class="mx-4 body-2">Drag the sliders to refine your selection. When you're finished, tap create.</span>
			<span class="mx-4 my-2 subtitle-1">Selected: {{ songCount }} Tracks, {{ mixDuration }}</span>
		</v-row>
		<v-row class="px-3"> </v-row>
		<div v-if="mountFilters">
			<playlist-filter
				v-for="filter in filters"
				:showMoreFilters="showMoreFilters"
				:bars="bars"
				:key="filter.key"
				:renderKey="renderKey"
				:tracks="audioFeatures"
				:name="filter.name"
				:filter="filter.id"
				:filters="filters"
				:range="[filter.defaultRange[0], filter.defaultRange[1]]"
				:segmentSize="filter.segmentSize"
				:chartData="chartData[filter.id]"
				:chartReady="chartsReady"
				@filterChartData="updateFilters"
			/>
		</div>
		<v-row>
			<v-btn text class="ml-4 plain-btn" @click="showMoreFilters = !showMoreFilters">{{
				!showMoreFilters ? "More filters" : "Show less"
			}}</v-btn>
			<v-dialog v-model="confirm" width="300">
				<v-card v-if="!loading && !createNewPlaylist && !addToPlaylist" class="pb-8">
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
					<v-card-text>{{ songCount }} tracks {{ mixDuration }}</v-card-text>
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
import PlaylistFilter from "../containers/PlaylistFilter";
import "vue-slider-component/theme/default.css";
import _ from "lodash";
import msToHMS from "@/scripts/msToHMS";
// import getIDsFromDetails from "@/scripts/getIDsFromDetails";
import Playlist from "../containers/Playlist";

export default {
	name: "create-playlist",
	components: {
		"playlist-filter": PlaylistFilter,
		"user-playlist": Playlist
	},
	data: function() {
		return {
			//features.data
			loading: false,
			bars: true,
			audioFeatures: features,
			chartData: Object,
			chartsReady: false,
			renderKey: 1,
			playlistName: undefined,
			createNewPlaylist: false,
			addToPlaylist: false,
			finishedWithSelection: false,
			showMoreFilters: false,
			confirm: false,
			mountFilters: false,
			reviewCategory: null,
			filters: {
				doubletime: {
					//Beats per minute
					range: [100, 200], //Current selected range
					defaultRange: [100, 200], //Starting range selection
					segmentSize: 10, //E.g 10bpm per block. Lowering this creates a more granular selection
					name: "beats per minute",
					id: "doubletime"
				},
				energy: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "energy",
					id: "energy"
				},
				instrumentalness: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "instrumentalness",
					id: "instrumentalness"
				},
				danceability: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "danceability",
					id: "danceability"
				},
				valence: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "valence",
					id: "valence"
				}
			}
		};
	},
	computed: {
		selectedTracks: function() {
			//Decides which tracks meet all selected filters and adds to an array
			let tracksArray = [];
			this.audioFeatures.forEach(track => {
				if (
					track.features.doubletime >= this.filters.doubletime.range[0] &&
					track.features.doubletime <= this.filters.doubletime.range[1] &&
					track.features.instrumentalness >= this.filters.instrumentalness.range[0] / 100 &&
					track.features.instrumentalness <= this.filters.instrumentalness.range[1] / 100 &&
					track.features.danceability >= this.filters.danceability.range[0] / 100 &&
					track.features.danceability <= this.filters.danceability.range[1] / 100 &&
					track.features.energy >= this.filters.energy.range[0] / 100 &&
					track.features.energy <= this.filters.energy.range[1] / 100 &&
					track.features.valence >= this.filters.valence.range[0] / 100 &&
					track.features.valence <= this.filters.valence.range[1] / 100
				)
					tracksArray.push(track);
			});
			return tracksArray;
		},
		songCount: function() {
			return this.selectedTracks.length;
		},
		mixDuration: function() {
			let totalLength = 0;
			this.selectedTracks.forEach(track => {
				totalLength += track.track.duration_ms;
			});
			//Convert time in ms to hours minutes seconds and return
			return msToHMS(totalLength);
		},
		tempos: function() {
			let tempos = [];
			this.selectedTracks.map(el => {
				tempos.push(el.features.tempo);
			});
			return tempos;
		},
		lowBPM: function() {
			return _.min(this.tempos);
		},
		highBPM: function() {
			return _.max(this.tempos);
		},
		filterArray: function() {
			return Object.entries(this.filters);
		}
	},
	methods: {
		closeModal() {
			this.confirm = false;
			this.createNewPlaylist = false;
		},
		savePlaylist() {
			const metadata = JSON.stringify({
				lowBPM: this.lowBPM,
				highBPM: this.highBPM,
				tracks: this.songCount,
				duration: this.mixDuration
			});
			const selectedTracks = JSON.stringify(this.selectedTracks);
			localStorage.setItem("playlistMetadata", metadata);
			localStorage.setItem("playlistTracks", selectedTracks);
			this.$router.push("Save");
		},
		createPlaylistFromSelection() {
			this.$emit("storePlaylistInfo", "yoyo");
			// return new Promise((resolve, reject) => {
			// 	//Get array of selected track's IDs.
			// 	const trackIDs = getIDsFromDetails(this.selectedTracks);
			// 	//Collect metadata
			// 	const metadata = JSON.stringify({
			// 		name: this.playlistName,
			// 		lowBPM: this.lowBPM,
			// 		highBPM: this.highBPM,
			// 		tracks: this.songCount,
			// 		duration: this.mixDuration
			// 	});
			// 	this.$emit("loading");
			// 	//Create the playlist
			// 	this.$http
			// 		.post("http://192.168.1.215:3000/playlists", {
			// 			data: {
			// 				userID: this.$attrs.user.id,
			// 				trackIDs: trackIDs,
			// 				metadata: metadata,
			// 				name: this.playlistName,
			// 				credentials: localStorage.RunBPM
			// 			}
			// 		})
			// 		.then(() => {
			// 			this.updateUserInfo();
			// 			//Check to see if user info has updated before resolving promise
			// 			let i = setInterval(() => {
			// 				if (!this.$attrs.loading) {
			// 					clearInterval(i);
			// 					resolve();
			// 				}
			// 			}, 20);
			// 		})
			// 		.catch(err => {
			// 			console.log("Something went wrong", err);
			// 			this.loading = false;
			// 			reject();
			// 		});
			// });
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
	watch: {
		selectedTracks() {
			this.initChartData();
		}
	},
	mounted: function() {
		this.updateUserInfo();
		let playlists = [];
		//Checks for tracks in params (coming from import) or in localstorage (incase of refresh)
		if (this.$route.params.playlists || localStorage.playlists) {
			if (localStorage.playlists && !this.$route.params.playlists) {
				playlists = JSON.parse(localStorage.playlists);
			} else {
				playlists = this.$route.params.playlists;
				localStorage.setItem("playlists", JSON.stringify(playlists));
			}
			setTimeout(10);
			//Gets audio features for selected tracks
			this.$http
				.post("http://192.168.1.215:3000/analyze-tracks", {
					data: {
						playlists: playlists,
						credentials: localStorage.RunBPM
					}
				})
				.then(response => {
					//Creates one array with both audio features and track details
					this.audioFeatures = _.zipWith(response.data.playlistDetails, response.data.audioFeatures, function(a, b) {
						return { track: a.track, features: b };
					});
					this.convertToDoubletime();
					this.initChartData();
				})
				.catch(err => {
					console.log(err);
				});
		} else this.$router.push("/");
	}
};
</script>

<style scoped>
.plain-btn:hover:before {
	background-color: transparent;
}
.no-word-break {
	word-break: keep-all;
}
.filter-container-sm {
	height: 100px;
}
.review-circle {
	height: 25px;
	width: 25px;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.3);
}
</style>

<style>
.add-photo .v-input__control .v-input__slot:before {
	border: none !important;
}
</style>
