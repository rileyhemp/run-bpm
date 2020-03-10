<template>
	<v-container fluid>
		<v-row class="pr-2">
			<v-btn text class="ml-2" @click="() => this.$router.push('Import')">Back</v-btn>
			<v-spacer />
			<v-btn color="primary" class="mr-2" :disabled="loading || !playlistName" @click="confirm = true">Create</v-btn>
		</v-row>
		<v-row class="mt-6 mb-2 mx-2">
			<p class="subtitle-1">Step 2 / 2</p>
			<v-spacer />
			<p class="subtitle-1">Refine your selection</p>
		</v-row>
		<v-row>
			<v-spacer />
			<v-btn class="mr-1" icon @click="bars = true">
				<v-icon :color="!bars ? 'default' : 'primary'">mdi-chart-bar</v-icon>
			</v-btn>
			<v-btn class="mr-1" icon @click="bars = false">
				<v-icon :color="bars ? 'default' : 'primary'">mdi-chart-line</v-icon>
			</v-btn>
		</v-row>
		<div v-if="mountFilters">
			<playlist-filter
				v-for="filter in filters"
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
		<v-row class="px-4 mt-8">
			<v-text-field label="Title yor mix" hide-details="auto" v-model="playlistName" />
		</v-row>
		<v-row class="mt-3">
			<span class="mx-4 my-2 body-2">{{ songCount }} Tracks {{ mixDuration }}</span>
		</v-row>
		<v-row>
			<radar-chart v-if="this.chartsReady" :chartData="this.chartData" :key="renderKey" />
		</v-row>
		<v-row>
			<v-dialog v-model="confirm" width="300">
				<v-card v-if="!loading">
					<v-card-actions>
						<v-spacer />
						<v-btn icon @click="confirm = false"><v-icon>mdi-close</v-icon></v-btn>
					</v-card-actions>
					<v-card-title class="subtitle-1 no-word-break">"{{ playlistName }}" will be added to your Spotify library.</v-card-title>
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
import RadarChart from "../components/RadarChart";
import "vue-slider-component/theme/default.css";
import _ from "lodash";
import msToHMS from "@/scripts/msToHMS";
import getIDsFromDetails from "@/scripts/getIDsFromDetails";

export default {
	name: "create-playlist",
	components: {
		"playlist-filter": PlaylistFilter,
		"radar-chart": RadarChart
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
			finishedWithSelection: false,
			confirm: false,
			mountFilters: false,
			filters: {
				doubletime: {
					range: [100, 200],
					defaultRange: [100, 200],
					segmentSize: 10,
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
				},
				acousticness: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "acousticness",
					id: "acousticness"
				}
			}
		};
	},
	computed: {
		selectedTracks: function() {
			let tracksArray = [];
			this.audioFeatures.forEach(track => {
				if (
					track.features.doubletime >= this.filters.doubletime.range[0] &&
					track.features.doubletime <= this.filters.doubletime.range[1] &&
					track.features.acousticness >= this.filters.acousticness.range[0] / 100 &&
					track.features.acousticness <= this.filters.acousticness.range[1] / 100 &&
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
		createPlaylistFromSelection() {
			return new Promise((resolve, reject) => {
				//Get array of selected track's IDs.
				const trackIDs = getIDsFromDetails(this.selectedTracks);
				//Collect metadata
				const metadata = JSON.stringify({
					name: this.playlistName,
					lowBPM: this.lowBPM,
					highBPM: this.highBPM,
					tracks: this.songCount,
					duration: this.mixDuration
				});
				this.$emit("loading");
				//Create the playlist
				this.$http
					.post("http://localhost:3000/playlists", {
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
		}
	},
	watch: {
		selectedTracks() {
			this.initChartData();
		}
	},
	mounted: function() {
		this.convertToDoubletime();
		this.initChartData();

		// this.updateUserInfo();
		// let playlists = [];
		// if (this.$route.params.playlists || localStorage.playlists) {
		// 	if (localStorage.playlists && !this.$route.params.playlists) {
		// 		playlists = JSON.parse(localStorage.playlists);
		// 	} else {
		// 		playlists = this.$route.params.playlists;
		// 		localStorage.setItem("playlists", JSON.stringify(playlists));
		// 	}
		// 	setTimeout(10);
		// 	this.$http
		// 		.post("http://localhost:3000/analyze-tracks", {
		// 			data: {
		// 				playlists: playlists,
		// 				credentials: localStorage.RunBPM
		// 			}
		// 		})
		// 		.then(response => {
		// 			this.audioFeatures = _.zipWith(response.data.playlistDetails, response.data.audioFeatures, function(a, b) {
		// 				return { track: a.track, features: b };
		// 			});
		// 			this.initChartData();
		// 		})
		// 		.catch(err => {
		// 			console.log(err);
		// 		});
		// } else this.$router.push("/");
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
</style>

<style>
.add-photo .v-input__control .v-input__slot:before {
	border: none !important;
}
</style>
