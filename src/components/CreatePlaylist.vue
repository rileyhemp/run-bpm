<template>
	<v-container fluid>
		<v-row class="pr-2">
			<v-spacer />
			<v-btn class="mr-1" icon @click="radar=false, line=false">
				<v-icon :color="radar ? 'default' : 'primary'">mdi-chart-bar</v-icon>
			</v-btn>
			<v-btn class="mr-1" icon @click="radar=false, line=true">
				<v-icon :color="radar && line ? 'default' : 'primary'">mdi-graph-line</v-icon>
			</v-btn>
			<v-btn icon @click="radar=true">
				<v-icon :color="radar ? 'primary' : 'default'">mdi-spider-web</v-icon>
			</v-btn>
		</v-row>
		<radar-chart v-if="this.chartReady && radar" :chartData="this.chartData" :key="renderKey" />
		<line-graph v-if="this.chartReady && !radar" :chartData="this.chartData" :key="renderKey" />
		<vue-slider
			:min="100"
			:max="200"
			v-model="sliderRange"
			tooltip="none"
			:enable-cross="false"
			class="px-2"
			:marks="[sliderRange[0], sliderRange[1]]"
			@change="this.updateChartData"
		></vue-slider>
	</v-container>
</template>
	
<script>
import features from "../assets/temp-features";
import details from "../assets/temp-details";
import RadarChart from "../components/RadarChart";
import LineGraph from "../components/LineGraph";
import VueSlider from "vue-slider-component";
import gsap from "gsap";
import "vue-slider-component/theme/material.css";
import _ from "lodash";

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
			sliderRange: [100, 200],
			renderKey: 1
		};
	},
	methods: {
		updateChartData() {
			this.chartData[0].forEach(el => {
				const duration = 0.75;
				if (
					el.axis < this.sliderRange[0] ||
					el.axis > this.sliderRange[1]
				) {
					gsap.to(el, {
						value: 0.01,
						duration: duration
					});
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
		},
		initSpiderChart() {
			//Double tempo for tracks under 100bpm
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
			this.chartReady = true;
			this.chartData = [tempoSegments];
		}
	},
	mounted: function() {
		//Combines audio features and track details for each track into a single object
		this.audioFeatures = _.zipWith(
			this.playlistDetailsTemp,
			this.audioFeaturesTemp,
			function(a, b) {
				return { track: a.track, features: b };
			}
		);
		this.initSpiderChart();
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
};
</script>