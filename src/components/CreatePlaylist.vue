<template>
	<v-container fluid>
		<v-row class="pr-2">
			<v-spacer />
			<v-btn class="mr-1" icon @click="radar=false, trend=false, bars=true">
				<v-icon :color="radar || trend ? 'default' : 'primary'">mdi-chart-bar</v-icon>
			</v-btn>
			<v-btn class="mr-1" icon @click="radar=false, bars=false, trend=true">
				<v-icon :color="radar || bars ? 'default' : 'primary'">mdi-chart-line</v-icon>
			</v-btn>
			<v-btn icon @click="radar=true, bars=false, trend=false">
				<v-icon :color="bars || trend ? 'default' : 'primary'">mdi-spider-web</v-icon>
			</v-btn>
		</v-row>
		<radar-chart v-if="this.chartReady && radar" :chartData="this.chartData" :key="renderKey" />
		<line-graph
			:type="bars ? 'bar' : 'trend'"
			v-if="this.chartReady && !radar"
			:chartData="this.chartData"
			:key="renderKey"
		/>
		<vue-slider
			:min="100"
			:max="200"
			v-model="sliderRange"
			tooltip="none"
			:enable-cross="false"
			class="px-3"
			:marks="[sliderRange[0], sliderRange[1]]"
			@change="this.filterChartData"
		></vue-slider>
		<v-row class="px-4 mt-8">
			<v-text-field label="Title yor mix" hide-details="auto" />
		</v-row>
		<v-row class="mt-3">
			<span class="mx-4 my-2 body-2">{{songCount}} Tracks {{mixDuration}}</span>
			<!-- <v-spacer /> -->
			<!-- <v-btn flat text medium>EDIT SELECTION</v-btn> -->
		</v-row>
		<v-row class="pl-2 mt-2">
			<v-btn icon>
				<v-icon :color="'primary'">mdi-image-plus</v-icon>
			</v-btn>
			<span class="py-2 body-3">Add a photo</span>
		</v-row>
		<v-row class="pl-2">
			<v-btn icon>
				<v-icon :color="'blue-grey lighten-2'">mdi-earth</v-icon>
			</v-btn>
			<span class="py-2 body-3">Make public</span>
		</v-row>
		<v-row class="pr-4 mt-8">
			<v-btn
				text
				:ripple="false"
				@click="this.createPlaylistFromSelection"
				class="plain-btn"
			>Add another</v-btn>
			<v-spacer />
			<v-btn color="primary" @click="createPlaylistFromSelection(); finishedWithSelection=true">Done</v-btn>
		</v-row>
	</v-container>
</template>
	
<script>
import features from "../assets/temp-features";
import details from "../assets/temp-details";
import RadarChart from "../components/RadarChart";
import LineGraph from "../components/LineGraph";
import VueSlider from "vue-slider-component";
import gsap from "gsap";
import "vue-slider-component/theme/default.css";
import _ from "lodash";
import msToHMS from "../scripts/msToHMS";
import getIDsFromDetails from "../scripts/getIDsFromDetails";

export default {
	name: "create-playlist",
	components: {
		"radar-chart": RadarChart,
		"line-graph": LineGraph,
		VueSlider
	},
	data: function() {
		return {
			loading: true,
			audioFeaturesTemp: features.data,
			playlistDetailsTemp: details,
			audioFeatures: Object,
			initialPlaylist: Object,
			chartData: Array,
			chartReady: false,
			radar: false,
			trend: false,
			bars: true,
			sliderRange: [100, 200],
			renderKey: 1,
			playlistName: undefined,
			finishedWithSelection: false,
			defaultPlaylistName: "Running Playlist"
		};
	},
	computed: {
		selectedTracks: function() {
			let tracksArray = [];
			Object.keys(this.audioFeatures).forEach(i => {
				let track = this.audioFeatures[i];
				let bpmSliderRangeLow = this.sliderRange[0];
				let bpmSliderRangeHigh = this.sliderRange[1];
				if (
					track.features.doubletime >= bpmSliderRangeLow &&
					track.features.doubletime <= bpmSliderRangeHigh
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
		}
	},
	methods: {
		createPlaylistFromSelection() {
			const name =
				this.playlistName != undefined
					? this.playlistName
					: this.defaultPlaylistName;
			//Get array of selected track's IDs.
			const trackIDs = getIDsFromDetails(this.selectedTracks);
			//Collect metadata
			const metadata = JSON.stringify({
				name: name,
				lowBPM: this.lowBPM,
				highBPM: this.highBPM,
				tracks: this.songCount,
				duration: this.mixDuration
			});
			this.isLoading = true;
			//Create the playlist
			this.$http
				.post("http://localhost:3000/create-playlist", {
					data: {
						userID: this.$attrs.user.id,
						trackIDs: trackIDs,
						metadata: metadata,
						name: name
					}
				})
				.then(response => {
					console.log(response);
				})
				.catch(err => {
					this.isLoading = false;
					console.log("Something went wrong", err);
				});
		},
		doneCheck() {
			//Check if user is done or wants to add more playlists
			this.finishedWithSelection
				? this.$router.push("dashboard")
				: this.resetScreen();
			this.isLoading = false;
		},
		resetScreen() {
			//Get the users created playlists for session
			//Get specific list vs get all lists

			//Reset the selection, slider range, and chart
			this.playlistName = undefined;
			this.sliderRange = [100, 200];
			setTimeout(() => this.filterChartData(), 150);
		},
		initChartData() {
			//Double tempo for tracks under 100bpm.
			//Reason: 80bpm and 160bpm line up on the same cadence and should be treated as equal.
			this.audioFeatures.forEach(track => {
				track.features.tempo = Math.round(track.features.tempo);
				track.features.tempo < 100
					? (track.features.doubletime = track.features.tempo * 2)
					: (track.features.doubletime = track.features.tempo);
			});
			//Group tracks that are within 5bpm of each other
			let tempoSegments = [];
			for (let i = 100; i < 200; i = i + 10) {
				let segment = {};
				let tracks = 0;
				this.audioFeatures.forEach(track => {
					track.features.doubletime >= i &&
					track.features.doubletime < i + 10
						? tracks++
						: null;
				});
				segment.axis = i;
				segment.value = tracks / this.audioFeatures.length;
				segment.valueSave = tracks / this.audioFeatures.length;
				segment.outOfRange = false;
				segment.tracks = tracks;
				tempoSegments.push(segment);
			}
			//Let the charts know the data is ready and they can render
			this.chartReady = true;
			this.chartData = [tempoSegments];
		},
		filterChartData: _.throttle(function() {
			//Filters charts in real time
			this.chartData[0].forEach(el => {
				const duration = 0.75;
				if (
					el.axis < this.sliderRange[0] ||
					el.axis > this.sliderRange[1]
				) {
					gsap.to([el], {
						value: 0.01,
						duration: duration
					});
					//Tweening the so-called 'render key' forces the graphs the refresh on each tween iteration
					gsap.to(this, {
						renderKey: this.renderKey + 1,
						duration: duration
					});
				} else {
					gsap.to(el, {
						value: el.valueSave,
						duration: duration
					});
					gsap.to(this, {
						renderKey: this.renderKey + 1,
						duration: duration
					});
				}
			});
		}, 100)
	},
	mounted: function() {
		//Combines audio features and track details into a single object
		this.audioFeatures = _.zipWith(
			this.playlistDetailsTemp,
			this.audioFeaturesTemp,
			function(a, b) {
				return { track: a.track, features: b };
			}
		);
		this.initChartData();
	}
	// mounted: function() {
	// 	this.$http
	// 		.post("http://localhost:3000/analyze-selected", {
	// 			data: {
	// 				playlists: this.$route.params.playlists
	// 			}
	// 		})
	// 		.then(response => {
	// 			console.log(response);
	// 			console.log(this.$route.params.playlists);
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 		});
	// }
	//Saves the created playlists locally until user is finished with track set
	// const saved = localStorage.getItem("stashedPlaylists")
	// 	? JSON.parse(localStorage.getItem("stashedPlaylists"))
	// 	: [];
	// saved.push(id);
	// localStorage.setItem("stashedPlaylists", JSON.stringify(saved));
};
</script>

<style scoped>
.plain-btn:hover:before {
	background-color: transparent;
}
</style>



