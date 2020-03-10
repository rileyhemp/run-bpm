<template>
	<div class="mx-2">
		<p class="overline">{{ name }}</p>
		<radar-chart v-if="this.chartReady && radar" :chartData="this.chartData" :key="renderKey" />
		<line-graph :type="bars ? 'bar' : 'trend'" :height="height" v-if="this.chartReady && !radar" :chartData="this.chartData" :key="renderKey" />
		<vue-slider
			:min="range[0]"
			:max="range[1]"
			v-model="sliderRange"
			tooltip="none"
			class="px-3"
			:enable-cross="false"
			:marks="[sliderRange[0], sliderRange[1]]"
			@change="filterThrottled"
			@drag-end="filterChartData"
		></vue-slider>
	</div>
</template>

<script>
import LineGraph from "../components/LineGraph";
import RadarChart from "../components/RadarChart";
import VueSlider from "vue-slider-component";
import _ from "lodash";
// import gsap from "gsap";
import "vue-slider-component/theme/default.css";
export default {
	components: {
		"line-graph": LineGraph,
		"radar-chart": RadarChart,
		VueSlider
	},
	props: ["tracks", "name", "range", "feature", "chunkSize", "height", "filters"],
	data: function() {
		return {
			chartData: Array,
			renderKey: 1,
			chartReady: false,
			radar: false,
			trend: false,
			bars: true,
			sliderRange: [100, 200]
		};
	},
	methods: {
		// initChartData() {
		// 	//Group tracks that are within 5bpm of each other
		// 	let tempoSegments = [];
		// 	for (let i = this.sliderRange[0]; i < this.sliderRange[1]; i = i + this.chunkSize) {
		// 		let segment = {};
		// 		let tracks = 0;
		// 		this.tracks.forEach(track => {
		// 			track.features[this.feature] >= i && track.features[this.feature] < i + this.chunkSize ? tracks++ : null;
		// 		});
		// 		segment.axis = i;
		// 		segment.value = tracks / this.tracks.length;
		// 		segment.valueSave = tracks / this.tracks.length;
		// 		segment.outOfRange = false;
		// 		segment.tracks = tracks;
		// 		tempoSegments.push(segment);
		// 	}
		// 	//Let the charts know the data is ready and they can render
		// 	this.chartReady = true;
		// 	this.chartData = [tempoSegments];
		// },
		animateChart: function() {
			//Filters charts in real time
			// const filters = Object.keys(this.filters);
			// console.log(filters);
			// this.chartData[0].forEach(el => {
			// 	const duration = 0.75;
			// 	let test = el;
			// if (el.axis < this.sliderRange[0] || el.axis > this.sliderRange[1]) {
			// 	gsap.to([el], {
			// 		value: 0.01,
			// 		duration: duration
			// 	});
			// 	//Tweening the so-called 'render key' forces the graphs the refresh on each tween iteration
			// 	gsap.to(this, {
			// 		renderKey: this.renderKey + 1,
			// 		duration: duration
			// 	});
			// } else {
			// 	gsap.to(el, {
			// 		value: el.valueSave,
			// 		duration: duration
			// 	});
			// 	gsap.to(this, {
			// 		renderKey: this.renderKey + 1,
			// 		duration: duration
			// 	});
			// }
			// });
		},
		// Throttle the @change event, but catch the final value via the drag-end event.
		filterThrottled: _.throttle(function() {
			this.filterChartData();
		}, 300),
		filterChartData: function() {
			this.$emit("filterChartData", {
				range: this.sliderRange,
				scale: this.chunkSize,
				filter: this.feature
			});
		}
	},
	watch: {
		filters: {
			handler() {
				this.animateChart();
			},
			deep: true
		}
	},
	mounted: function() {
		// this.initChartData();
		// this.animateChart();
	}
};
</script>
