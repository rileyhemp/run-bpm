<template>
	<v-container fluid>
		<v-row class="pr-2">
			<v-btn text class="ml-4" @click="() => this.$router.push('Import')">Back</v-btn>
			<v-spacer />
			<v-btn class="mr-1" icon @click="(radar = false), (trend = false), (bars = true)">
				<v-icon :color="radar || trend ? 'default' : 'primary'">mdi-chart-bar</v-icon>
			</v-btn>
			<v-btn class="mr-1" icon @click="(radar = false), (bars = false), (trend = true)">
				<v-icon :color="radar || bars ? 'default' : 'primary'">mdi-chart-line</v-icon>
			</v-btn>
			<v-btn icon @click="(radar = true), (bars = false), (trend = false)">
				<v-icon :color="bars || trend ? 'default' : 'primary'">mdi-spider-web</v-icon>
			</v-btn>
		</v-row>
		<radar-chart v-if="this.chartReady && radar" :chartData="this.chartData" :key="renderKey" />
		<line-graph :type="bars ? 'bar' : 'trend'" v-if="this.chartReady && !radar" :chartData="this.chartData" :key="renderKey" />
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
			<v-text-field label="Title yor mix" hide-details="auto" v-model="playlistName" />
		</v-row>
		<v-row class="mt-3">
			<span class="mx-4 my-2 body-2">{{ songCount }} Tracks {{ mixDuration }}</span>
			<v-spacer />
			<v-btn text medium>EDIT SELECTION</v-btn>
		</v-row>
		<v-row class="pl-2 mt-2">
			<v-file-input label="Add a photo" accept="image/*" prepend-icon="mdi-image-plus" class="mx-2 body-3 add-photo"> </v-file-input>
		</v-row>
		<v-row>
			<v-spacer />
			<v-btn color="primary" class="mr-4" :disabled="loading || !playlistName" @click="confirm = true">Create</v-btn>
			<v-dialog v-model="confirm" width="300">
				<v-card v-if="!loading">
					<v-card-title class="subtitle-1 no-word-break">"{{ playlistName }}" will be added to your Spotify library</v-card-title>
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
									this.createPlaylistFromSelection().then(() => this.$router.push('Dashboard'));
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
import details from "@/assets/temp-details";
import RadarChart from "../single_purpose/RadarChart";
import LineGraph from "../single_purpose/LineGraph";
import VueSlider from "vue-slider-component";
import gsap from "gsap";
import "vue-slider-component/theme/default.css";
import _ from "lodash";
import msToHMS from "@/scripts/msToHMS";
import getIDsFromDetails from "@/scripts/getIDsFromDetails";

export default {
	name: "create-playlist",
	components: {
		"radar-chart": RadarChart,
		"line-graph": LineGraph,
		VueSlider
	},
	data: function() {
		return {
			loading: false,
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
			confirm: false
		};
	},
	computed: {
		selectedTracks: function() {
			let tracksArray = [];
			Object.keys(this.audioFeatures).forEach(i => {
				let track = this.audioFeatures[i];
				let bpmSliderRangeLow = this.sliderRange[0];
				let bpmSliderRangeHigh = this.sliderRange[1];
				if (track.features.doubletime >= bpmSliderRangeLow && track.features.doubletime <= bpmSliderRangeHigh) tracksArray.push(track);
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
				this.sliderRange = [100, 200];
				setTimeout(() => this.filterChartData(), 150);
			});
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
					track.features.doubletime >= i && track.features.doubletime < i + 10 ? tracks++ : null;
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
				if (el.axis < this.sliderRange[0] || el.axis > this.sliderRange[1]) {
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
		let playlists = [];
		if (this.$route.params.playlists || localStorage.playlists) {
			if (localStorage.playlists && !this.$route.params.playlists) {
				playlists = JSON.parse(localStorage.playlists);
			} else {
				playlists = this.$route.params.playlists;
				localStorage.setItem("playlists", JSON.stringify(playlists));
			}
			setTimeout(10);
			this.$http
				.post("http://localhost:3000/analyze-tracks", {
					data: {
						playlists: playlists,
						credentials: localStorage.RunBPM
					}
				})
				.then(response => {
					this.audioFeatures = _.zipWith(response.data.playlistDetails, response.data.audioFeatures, function(a, b) {
						return { track: a.track, features: b };
					});
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
</style>

<style>
.add-photo .v-input__control .v-input__slot:before {
	border: none !important;
}
</style>
