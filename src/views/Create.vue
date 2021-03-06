// eslint-disable-file
<template>
	<v-container fluid :key="renderKey">
		<v-row class="pr-4 sticky-nav">
			<v-btn text class="ml-4" @click="() => this.$router.push('Import')">Back</v-btn>
			<v-spacer />
			<v-btn v-if="$vuetify.breakpoint.smAndDown" color="primary" :disabled="loading" @click="savePlaylist">Save Playlist</v-btn>
		</v-row>
		<v-row class="mt-6 mx-4">
			<p class="subtitle-1">Step 2 / 3</p>
			<p class="subtitle-1 pl-2">Filter tracks</p>
		</v-row>
		<v-row class="px-3">
			<span class="mx-4 body-2">Drag the sliders to refine your selection, or choose edit tracks for more granular control.</span>
		</v-row>
		<v-row class="px-3 pt-4">
			<span class="mx-4 body-2"
				>Tracks: {{ songCount }} <br />
				Duration: {{ mixDuration }} <br />
			</span>
		</v-row>
		<v-row class="px-3 pt-4">
			<v-btn color="grey-lighten-2" class="mx-4" @click="editPlaylist = true">Edit Tracks</v-btn>
			<v-btn v-if="$vuetify.breakpoint.mdAndUp" color="primary" :disabled="loading" @click="savePlaylist">Save Playlist</v-btn>
			<v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" v-model="editPlaylist" id="tracks-container">
				<playlist-tracks :playlist="this.currentPlaylist" :filters="this.filters" @close="closeEditor" />
			</v-dialog>
		</v-row>
		<div v-if="mountFilters" class="filters-container px-3 mt-2">
			<playlist-filter
				v-for="filter in filters"
				:showMoreFilters="showMoreFilters"
				:bars="bars"
				:key="filter.key"
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
	</v-container>
</template>

<script>
import features from "@/assets/temp-features";
import PlaylistFilter from "../containers/PlaylistFilter";
import "vue-slider-component/theme/default.css";
import _ from "lodash";
import msToHMS from "@/scripts/msToHMS";
import PlaylistTracks from "../containers/PlaylistTracks";
// import getIDsFromDetails from "@/scripts/getIDsFromDetails";

export default {
	name: "create-playlist",
	components: {
		"playlist-filter": PlaylistFilter,
		"playlist-tracks": PlaylistTracks,
	},
	data: function() {
		return {
			loading: false,
			bars: true,
			audioFeatures: features,
			chartData: Object,
			chartsReady: false,
			editPlaylist: false,
			showMoreFilters: this.$vuetify.breakpoint.mdAndUp,
			mountFilters: false,
			renderKey: 1,
			test: {
				valence: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "valence",
					id: "valence",
				},
			},
			filters: {
				doubletime: {
					//Beats per minute
					range: [100, 200], //Current selected range
					defaultRange: [100, 200], //Starting range selection
					segmentSize: 10, //E.g 10bpm per block. Lowering this creates a more granular selection
					name: "beats per minute",
					id: "doubletime",
				},
				energy: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "energy",
					id: "energy",
				},
				instrumentalness: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "instrumentalness",
					id: "instrumentalness",
				},
				danceability: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "danceability",
					id: "danceability",
				},
				acousticness: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "acousticness",
					id: "acousticness",
				},
				valence: {
					range: [0, 100],
					defaultRange: [0, 100],
					segmentSize: 10,
					name: "valence",
					id: "valence",
				},
			},
		};
	},
	computed: {
		currentPlaylist: _.throttle(function() {
			//Decides which tracks meet all selected filters and adds to an array
			let tracksArray = [];
			this.audioFeatures.forEach((track) => {
				if (
					track.features.doubletime >= this.filters.doubletime.range[0] &&
					track.features.doubletime <= this.filters.doubletime.range[1] &&
					track.features.instrumentalness >= this.filters.instrumentalness.range[0] / 100 &&
					track.features.instrumentalness <= this.filters.instrumentalness.range[1] / 100 &&
					track.features.danceability >= this.filters.danceability.range[0] / 100 &&
					track.features.danceability <= this.filters.danceability.range[1] / 100 &&
					track.features.energy >= this.filters.energy.range[0] / 100 &&
					track.features.energy <= this.filters.energy.range[1] / 100 &&
					track.features.acousticness >= this.filters.acousticness.range[0] / 100 &&
					track.features.acousticness <= this.filters.acousticness.range[1] / 100 &&
					track.features.valence >= this.filters.valence.range[0] / 100 &&
					track.features.valence <= this.filters.valence.range[1] / 100
				)
					tracksArray.push(track);
			});
			return tracksArray;
		}, 10),
		songCount: _.throttle(function() {
			return this.currentPlaylist.length;
		}, 10),
		mixDuration: _.throttle(function() {
			let totalLength = 0;
			this.currentPlaylist.forEach((track) => {
				totalLength += track.track.duration_ms;
			});
			//Convert time in ms to hours minutes seconds and return
			return msToHMS(totalLength);
		}, 10),
		tempos: _.throttle(function() {
			let tempos = [];
			this.currentPlaylist.map((el) => {
				tempos.push(el.features.doubletime);
			});
			return tempos;
		}, 10),
		lowBPM: _.throttle(function() {
			return _.min(this.tempos);
		}, 10),
		highBPM: _.throttle(function() {
			return _.max(this.tempos);
		}, 10),
		filterArray: function() {
			return Object.entries(this.filters);
		},
	},
	methods: {
		savePlaylist() {
			const metadata = JSON.stringify({
				lowBPM: this.lowBPM,
				highBPM: this.highBPM,
				tracks: this.songCount,
				duration: this.mixDuration,
			});
			const currentPlaylist = JSON.stringify(this.currentPlaylist);
			localStorage.setItem("playlistMetadata", metadata);
			localStorage.setItem("playlistTracks", currentPlaylist);
			this.$router.push("Save");
		},
		updateUserInfo() {
			this.$emit("updateUserInfo");
		},
		convertToDoubletime() {
			//Double tempo for tracks under 100bpm (90bpm ~= 180bpm)
			this.audioFeatures.forEach((track) => {
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
			filters.forEach((el) => {
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
					this.currentPlaylist.forEach((track) => {
						track.features[el] * multiplier >= i && track.features[el] * multiplier < i + filter.segmentSize ? tracks++ : null;
					});
					//Axis name
					segment.axis = i + 1;
					//Percentage of total tracks in segment
					segment.value = tracks / this.currentPlaylist.length;
					if ((segment.axis = 1 & (segment.value > 0.2))) {
						segment.value = 0.2;
					}
					segment.valueSave = tracks / this.currentPlaylist.length;
					//Number of tracks in segment
					segment.tracks = tracks;
					segments.push(segment);
				}
				this.chartData = { ...this.chartData, ...{ [el]: segments } };
				this.chartsReady = true;
			});
		},
		updateFilters: function(options) {
			this.$set(this.filters[options.filter], "range", options.range);
		},
		closeEditor(event) {
			this.audioFeatures = event;
			this.renderKey++;
			this.editPlaylist = false;
		},
	},
	watch: {
		currentPlaylist() {
			this.initChartData();
		},
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
				.post("https://d2ob92q3jfbd5e.cloudfront.net/analyze-tracks", {
					data: {
						playlists: playlists,
						credentials: localStorage.RunBPM,
					},
				})
				.then((response) => {
					//Creates one array with both audio features and track details
					this.audioFeatures = _.zipWith(response.data.playlistDetails, response.data.audioFeatures, function(a, b) {
						return { track: a.track, features: b };
					});
					this.convertToDoubletime();
					this.initChartData();
				})
				.catch((err) => {
					console.log(err);
				});
		} else this.$router.push("/");
	},
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
@media screen and (min-width: 600px) {
	.filters-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
}
</style>

<style>
.add-photo .v-input__control .v-input__slot:before {
	border: none !important;
}
</style>
