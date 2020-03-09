<template>
	<div class="mx-2">
		<p class="overline">{{ name }}</p>
		<radar-chart v-if="this.chartReady && radar" :chartData="this.chartData" :key="renderKey" />
		<line-graph :type="bars ? 'bar' : 'trend'" :height="100" v-if="this.chartReady && !radar" :chartData="this.chartData" :key="renderKey" />
		<vue-slider
			:min="100"
			:max="200"
			v-model="sliderRange"
			tooltip="none"
			class="px-3"
			:enable-cross="false"
			:marks="[sliderRange[0], sliderRange[1]]"
			@change="this.filterChartData"
		></vue-slider>
	</div>
</template>

<script>
import LineGraph from "../components/LineGraph";
import RadarChart from "../components/RadarChart";
import VueSlider from "vue-slider-component";
// import gsap from "gsap";
import "vue-slider-component/theme/default.css";
export default {
	components: {
		"line-graph": LineGraph,
		"radar-chart": RadarChart,
		VueSlider
	},
	props: ["audioFeatures", "name", "sliderRange", "feature", "chunkSize"],
	data: function() {
		return {
			chartData: Array,
			renderKey: 1,
			chartReady: false,
			radar: false,
			trend: false,
			bars: true
		};
	},
	methods: {
		initChartData() {
			//Group tracks that are within 5bpm of each other
			let tempoSegments = [];
			for (let i = this.sliderRange[0]; i < this.sliderRange[1]; i = i + this.chunkSize) {
				let segment = {};
				let tracks = 0;
				this.audioFeatures.forEach(track => {
					track.features[this.feature] >= i && track.features[this.feature] < i + 10 ? tracks++ : null;
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
		}
	},
	mounted: function() {
		this.initChartData();
	}
};
</script>
