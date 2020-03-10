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
			:marks="sliderRange"
			@drag-end="filterChartData"
		></vue-slider>
	</div>
</template>

<script>
import LineGraph from "../components/LineGraph";
import RadarChart from "../components/RadarChart";
import VueSlider from "vue-slider-component";
// import _ from "lodash";
// import gsap from "gsap";
import "vue-slider-component/theme/default.css";
export default {
	components: {
		"line-graph": LineGraph,
		"radar-chart": RadarChart,
		VueSlider
	},
	props: ["tracks", "name", "filter", "range", "segmentSize", "height", "filters", "chartData", "chartReady", "id", "renderKey"],
	data: function() {
		return {
			radar: false,
			trend: false,
			bars: true,
			sliderRange: this.range
		};
	},
	methods: {
		animateChart: function() {
			// Filters charts in real time
			// this.chartData.forEach(el => {
			// 	// const duration = 0.75;
			// 	if (el.axis < this.filters[this.filter].range[0] || el.axis > this.filters[this.filter].range[1]) {
			// 		gsap.to([el], {
			// 			value: 0,
			// 			duration: el.valueSave * 5,
			// 			ease: "none"
			// 		});
			// 		//Tweening the so-called 'render key' forces the graphs the refresh on each tween iteration
			// 		gsap.to(this, {
			// 			renderKey: this.renderKey + 1,
			// 			duration: el.valueSave * 5
			// 		});
			// 	} else {
			// 		gsap.to(el, {
			// 			value: el.valueSave,
			// 			duration: el.valueSave * 5,
			// 			ease: "none"
			// 		});
			// 		gsap.to(this, {
			// 			renderKey: this.renderKey + 1,
			// 			duration: el.valueSave * 5
			// 		});
			// 	}
			// });
		},
		// Throttle the @change event, but catch the final value via the drag-end event.
		// filterThrottled: _.throttle(function() {
		// 	this.$emit("filterChartData", {
		// 		range: this.sliderRange,
		// 		scale: this.segmentSize,
		// 		filter: this.filter
		// 	});
		// }, 10),
		filterChartData: function() {
			this.$emit("filterChartData", {
				range: this.sliderRange,
				scale: this.segmentSize,
				filter: this.filter
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
	mounted: function() {}
};
</script>
