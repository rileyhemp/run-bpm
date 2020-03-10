<template>
	<div class="mx-2 pb-4 mb-8 pt-2">
		<p class="overline" @click="collapse" :class="collapsed ? 'no-margin' : null">{{ name }}</p>
		<radar-chart v-if="this.chartReady && radar" :chartData="this.chartData" :key="renderKey" />
		<line-graph :type="bars ? 'bar' : 'trend'" :height="height" v-if="this.chartReady && !radar" :chartData="this.chartData" :key="renderKey" />
		<vue-slider
			:min="range[0]"
			:max="range[1]"
			v-model="sliderRange"
			tooltip="none"
			class="px-3 no-margin"
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
import gsap from "gsap";
import "vue-slider-component/theme/default.css";
export default {
	components: {
		"line-graph": LineGraph,
		"radar-chart": RadarChart,
		VueSlider
	},
	props: ["tracks", "name", "filter", "range", "segmentSize", "filters", "chartData", "chartReady", "id", "renderKey"],
	data: function() {
		return {
			radar: false,
			trend: false,
			bars: true,
			sliderRange: this.range,
			height: 100,
			collapsed: false
		};
	},
	methods: {
		collapse() {
			if (!this.collapsed) {
				gsap.to(this, {
					height: 0,
					duration: 0.2
				});
				this.collapsed = true;
			} else {
				gsap.to(this, {
					height: 100,
					duration: 0.2
				});
				this.collapsed = false;
			}
		},
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

<style>
.no-margin {
	margin: 0 !important;
}
.line-graph {
	margin: 0 !important;
}
</style>
