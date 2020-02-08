<template>
	<v-container fluid>
		<radar-chart :chartData="this.chartData" :chartReady="this.chartReady" />
	</v-container>
</template>
	
<script>
import features from "../assets/temp-features";
import details from "../assets/temp-details";
import RadarChart from "../components/RadarChart";
import _ from "lodash";
export default {
	name: "create-playlist",
	components: {
		"radar-chart": RadarChart
	},
	data: function() {
		return {
			loading: true,
			audioFeaturesTemp: features.data,
			playlistDetailsTemp: details,
			audioFeatures: Object,
			initialPlaylist: Object,
			passedData: [
				[
					{ axis: "100", value: 0.22 },
					{ axis: "105", value: 0.22 },
					{ axis: "110", value: 0.3 },
					{ axis: "115", value: 0.3 },
					{ axis: "120", value: 0.25 },
					{ axis: "125", value: 0.25 },
					{ axis: "130", value: 0.5 },
					{ axis: "135", value: 0.5 },
					{ axis: "140", value: 0.21 },
					{ axis: "145", value: 0.21 },
					{ axis: "150", value: 0.02 },
					{ axis: "155", value: 0.02 },
					{ axis: "160", value: 0.22 },
					{ axis: "165", value: 0.22 },
					{ axis: "170", value: 0.17 },
					{ axis: "175", value: 0.17 },
					{ axis: "180", value: 0.29 },
					{ axis: "185", value: 0.29 },
					{ axis: "190", value: 0.28 },
					{ axis: "195", value: 0.28 }
				]
			],
			chartData: Array,
			chartReady: false
		};
	},
	methods: {
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